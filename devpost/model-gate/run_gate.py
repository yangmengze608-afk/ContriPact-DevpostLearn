#!/usr/bin/env python3
import json, os, re, subprocess, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCENARIO = json.loads((ROOT / "scenario.json").read_text())
MODEL = os.environ.get("CONTRIPACT_MODEL", "contripact-spark-x2.5-4b-q4")
API = os.environ.get("OLLAMA_API", "http://127.0.0.1:11434/api/chat")
RESULTS = ROOT / "results"
RESULTS.mkdir(exist_ok=True)

SYSTEM = """You are the contribution-relevance analysis engine for ContriPact. Judge only from the competition rules and evidence supplied. Do not invent criteria, evidence, people, or facts. You are not an oracle of objective fairness. Separate evidence from interpretation. Return only JSON matching the requested schema."""

def chat(prompt, schema, max_tokens=900):
    payload = {
        "model": MODEL,
        "messages": [{"role": "system", "content": SYSTEM}, {"role": "user", "content": prompt}],
        "stream": False,
        "think": False,
        "format": schema,
        "options": {"num_ctx": 8192, "temperature": 0.0, "seed": 42, "top_p": 0.9, "num_predict": max_tokens}
    }
    req = urllib.request.Request(API, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
    t0 = time.perf_counter()
    with urllib.request.urlopen(req, timeout=240) as r:
        raw = json.loads(r.read())
    wall = time.perf_counter() - t0
    content = raw.get("message", {}).get("content", "")
    parsed = json.loads(content)
    eval_s = raw.get("eval_duration", 0) / 1e9
    metrics = {
        "wall_seconds": round(wall, 3),
        "load_seconds": round(raw.get("load_duration", 0) / 1e9, 3),
        "prompt_tokens": raw.get("prompt_eval_count"),
        "output_tokens": raw.get("eval_count"),
        "generation_seconds": round(eval_s, 3),
        "tokens_per_second": round((raw.get("eval_count") or 0) / eval_s, 2) if eval_s else None,
        "done_reason": raw.get("done_reason")
    }
    return parsed, metrics, raw

def ollama_process_snapshot():
    try:
        out = subprocess.check_output("ps axo rss=,command= | grep -E '[o]llama( |_llama_server)'", shell=True, text=True)
        rows = []
        for line in out.strip().splitlines():
            rss, cmd = line.strip().split(None, 1)
            rows.append({"rss_mb": round(int(rss)/1024, 1)})
        return rows
    except Exception:
        return []

RULE_SCHEMA = {"type":"object","properties":{"criteria":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"weight":{"type":"integer"},"reason":{"type":"string"},"evidence_quote":{"type":"string"}},"required":["name","weight","reason","evidence_quote"]}}},"required":["criteria"]}
BEFORE_SCHEMA = {'type':'object','properties':{'tasks':{'type':'array','items':{'type':'object','properties':{'task_id':{'type':'string','enum':[t['id'] for t in SCENARIO['planned_tasks']]},'linked_criteria':{'type':'array','items':{'type':'string','enum':[c['name'] for c in SCENARIO['criteria']]}},'contribution_relevance':{'type':'string','enum':['High','Medium','Supporting']},'reason':{'type':'string'}},'required':['task_id','linked_criteria','contribution_relevance','reason']}}},'required':['tasks']}
CONTRIB_SCHEMA = {'type': 'object', 'properties': {'members': {'type': 'array', 'items': {'type': 'object', 'properties': {'member': {'type': 'string', 'enum': ['A', 'B', 'C', 'D']}, 'evidence_ids': {'type': 'array', 'items': {'type': 'string', 'enum': ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']}}, 'linked_criteria': {'type': 'array', 'items': {'type': 'string', 'enum': [c['name'] for c in SCENARIO['criteria']]}}, 'contribution_relevance': {'type': 'string', 'enum': ['High', 'Medium', 'Supporting']}, 'reason': {'type': 'string'}, 'suggested_share_percent': {'type': 'integer'}}, 'required': ['member', 'evidence_ids', 'linked_criteria', 'contribution_relevance', 'reason', 'suggested_share_percent']}}, 'summary': {'type': 'string'}}, 'required': ['members', 'summary']}
OBJ_SCHEMA = {'type': 'object', 'properties': {'objection_id': {'type': 'string', 'enum': ['O1', 'O2', 'O3']}, 'support': {'type': 'string', 'enum': ['supported', 'partially_supported', 'unsupported']}, 'rule_connection': {'type': 'string', 'enum': ['NONE'] + [c['name'] for c in SCENARIO['criteria']]}, 'evidence_ids': {'type': 'array', 'items': {'type': 'string', 'enum': ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']}}, 'changes_contribution_assessment': {'type': 'boolean'}, 'recommendation_action': {'type': 'string', 'enum': ['revise', 'keep']}, 'reason': {'type': 'string'}}, 'required': ['objection_id', 'support', 'rule_connection', 'evidence_ids', 'changes_contribution_assessment', 'recommendation_action', 'reason']}

def validate_rules(x):
    expected = {c["name"]: c["weight"] for c in SCENARIO["criteria"]}
    got = x.get("criteria", [])
    names = [i.get("name") for i in got]
    weights = {i.get("name"): i.get("weight") for i in got}
    quotes_ok = all(i.get("evidence_quote", "") in SCENARIO["competition_brief"] for i in got)
    checks = {
        "exact_criterion_set": set(names) == set(expected),
        "weights_exact": all(weights.get(k) == v for k,v in expected.items()) and len(weights)==len(expected),
        "weights_sum_100": sum(i.get("weight",0) for i in got)==100,
        "no_extra_criteria": set(names).issubset(expected),
        "quotes_trace_to_brief": quotes_ok
    }
    return checks

def validate_before(x):
    valid_criteria = {c["name"] for c in SCENARIO["criteria"]}
    expected_tasks = {t["id"] for t in SCENARIO["planned_tasks"]}
    tasks = x.get("tasks", [])
    ids = [t.get("task_id") for t in tasks]
    by = {t.get("task_id"): t for t in tasks}
    levels = {t.get("contribution_relevance") for t in tasks}
    checks = {
        "exact_task_set": set(ids) == expected_tasks and len(ids) == len(expected_tasks),
        "criterion_links_valid": all(
            set(t.get("linked_criteria", [])).issubset(valid_criteria)
            and (t.get("contribution_relevance") == "Supporting" or len(t.get("linked_criteria", [])) > 0)
            for t in tasks
        ),
        "has_high_value_work": "High" in levels,
        "has_supporting_work": "Supporting" in levels,
        "core_build_links_design": "Design" in by.get("T1", {}).get("linked_criteria", []),
        "model_gate_links_design_or_innovation": any(c in by.get("T2", {}).get("linked_criteria", []) for c in ["Design", "Innovation/Idea"]),
        "demo_video_links_presentation": "Presentation" in by.get("T4", {}).get("linked_criteria", []),
        "submission_logistics_supporting": by.get("T5", {}).get("contribution_relevance") == "Supporting" and by.get("T5", {}).get("linked_criteria", []) == []
    }
    return checks

def validate_contrib(x):
    valid_criteria = {c["name"] for c in SCENARIO["criteria"]}
    evidence_owner = {e["id"]: m["member"] for m in SCENARIO["actual_contributions"] for e in m["evidence"]}
    members = x.get("members", [])
    ids = [m.get("member") for m in members]
    by = {m.get("member"): m for m in members}
    evidence_ok = all(
        len(m.get("evidence_ids", [])) > 0 and all(e in evidence_owner and evidence_owner[e] == m.get("member") for e in m.get("evidence_ids", []))
        for m in members
    )
    criteria_ok = all(len(m.get("linked_criteria", [])) > 0 and set(m.get("linked_criteria", [])).issubset(valid_criteria) for m in members)
    shares = {m.get("member"): m.get("suggested_share_percent", 0) for m in members}
    vals = list(shares.values())
    checks = {
        "exact_member_set": set(ids) == {"A","B","C","D"} and len(ids) == 4,
        "evidence_owned_by_member": evidence_ok,
        "criterion_links_valid": criteria_ok,
        "shares_sum_100": sum(vals) == 100,
        "shares_are_differentiated": bool(vals) and max(vals) - min(vals) >= 10,
        "broad_order_sanity": shares.get("A", 0) > shares.get("D", 100) and shares.get("B", 0) >= shares.get("D", 100),
        "core_work_links_expected_rubric": "Design" in by.get("A", {}).get("linked_criteria", []) and any(c in by.get("B", {}).get("linked_criteria", []) for c in ["Design", "Innovation/Idea"]),
        "demo_work_links_presentation": "Presentation" in by.get("D", {}).get("linked_criteria", [])
    }
    return checks

def validate_objections(x):
    checks_by = {c.get("objection_id"): c for c in x.get("checks", [])}
    expected_ids = {"O1","O2","O3"}
    valid_evidence = {e["id"] for m in SCENARIO["actual_contributions"] for e in m["evidence"]}
    trace_ok = all(set(c.get("evidence_ids", [])).issubset(valid_evidence) for c in checks_by.values())
    o1, o2, o3 = checks_by.get("O1", {}), checks_by.get("O2", {}), checks_by.get("O3", {})
    checks = {
        "exact_objection_set": set(checks_by) == expected_ids,
        "evidence_ids_valid": trace_ok,
        "O1_unsupported_clean_keep": o1.get("support") == "unsupported" and o1.get("rule_connection") == "NONE" and not o1.get("evidence_ids") and o1.get("recommendation_action") == "keep" and o1.get("changes_contribution_assessment") is False,
        "O2_recognizes_rubric_and_evidence": o2.get("support") in {"supported","partially_supported"} and o2.get("rule_connection") == "Presentation" and "D1" in o2.get("evidence_ids", []),
        "O2_already_recognized_keep": o2.get("changes_contribution_assessment") is False and o2.get("recommendation_action") == "keep",
        "O3_unsupported_clean_keep": o3.get("support") == "unsupported" and o3.get("rule_connection") == "NONE" and not o3.get("evidence_ids") and o3.get("recommendation_action") == "keep" and o3.get("changes_contribution_assessment") is False
    }
    return checks

def run_objection_batch(current_after):
    outputs, metrics_list = [], []
    for objection in SCENARIO["objections"]:
        prompt = f"""Check this ONE objection against only the supplied competition criteria and evidence. If unsupported, rule_connection MUST be NONE and evidence_ids MUST be empty. If supported or partially supported, rule_connection MUST name the single strongest exact criterion and evidence_ids must cite supporting evidence. Recommendation changes only if the objection changes the contribution assessment. Keep reason under 35 words.

CRITERIA:
{json.dumps(SCENARIO['criteria'], ensure_ascii=False)}
CURRENT VALIDATED CONTRIBUTION ASSESSMENT:
{json.dumps(current_after, ensure_ascii=False)}
EVIDENCE:
{json.dumps(SCENARIO['actual_contributions'], ensure_ascii=False)}
OBJECTION:
{json.dumps(objection, ensure_ascii=False)}"""
        parsed, metrics, raw = chat(prompt, OBJ_SCHEMA, 320)
        outputs.append(parsed)
        metrics_list.append(metrics)
    wrapped = {"checks": outputs}
    checks = validate_objections(wrapped)
    metrics = {
        "wall_seconds": round(sum(m["wall_seconds"] for m in metrics_list), 3),
        "prompt_tokens": sum((m["prompt_tokens"] or 0) for m in metrics_list),
        "output_tokens": sum((m["output_tokens"] or 0) for m in metrics_list),
        "tokens_per_second": round(sum((m["output_tokens"] or 0) for m in metrics_list) / max(sum(m["generation_seconds"] for m in metrics_list), 0.001), 2),
        "subcalls": metrics_list
    }
    passed = all(checks.values())
    bundle = {"test":"objection","model":MODEL,"passed":passed,"checks":checks,"metrics":metrics,"memory_snapshot":ollama_process_snapshot(),"output":wrapped}
    (RESULTS / "objection.json").write_text(json.dumps(bundle, ensure_ascii=False, indent=2))
    print(json.dumps({"test":"objection","passed":passed,"checks":checks,"metrics":metrics}, ensure_ascii=False, indent=2))
    return bundle

def run(name, prompt, schema, validator):
    parsed, metrics, raw = chat(prompt, schema, 650 if name == "rules" else 700 if name == "before" else 900 if name == "contribution" else 800)
    checks = validator(parsed)
    passed = all(checks.values())
    bundle = {"test":name,"model":MODEL,"passed":passed,"checks":checks,"metrics":metrics,"memory_snapshot":ollama_process_snapshot(),"output":parsed}
    (RESULTS / f"{name}.json").write_text(json.dumps(bundle, ensure_ascii=False, indent=2))
    print(json.dumps({"test":name,"passed":passed,"checks":checks,"metrics":metrics}, ensure_ascii=False, indent=2))
    return bundle

def main():
    rules_prompt = f"""Extract the judging criteria from this competition brief. Preserve the exact criterion names and integer weights. Do not add criteria. For evidence_quote, copy a short exact phrase from the brief that supports that criterion. Keep each reason under 20 words. Do not invent an importance label: the UI derives importance deterministically from numeric weights.\n\nBRIEF:\n{SCENARIO['competition_brief']}"""
    before_prompt = f"""Map each prepared planned task to the exact judging criteria it is expected to influence BEFORE the project starts. contribution_relevance (High/Medium/Supporting) describes the task's expected competitive relevance, never the person's worth. The submission-logistics task is supporting work, not a scored deliverable itself. Keep each reason under 22 words.\n\nCRITERIA:\n{json.dumps(SCENARIO['criteria'], ensure_ascii=False)}\n\nPLANNED TASKS:\n{json.dumps(SCENARIO['planned_tasks'], ensure_ascii=False)}"""
    contrib_prompt = f"""Evaluate the strongest CONTRIBUTION BUNDLE for each member, not the person's human value. Cite one or more supplied evidence IDs and only the exact criterion names shown. contribution_relevance (High/Medium/Supporting) describes how strongly that cited work bundle matters to competition outcomes, never the person's worth. Then give a suggested share percent for each member that sums to 100, as a contestable proposal rather than objective fairness. Keep each reason under 24 words.\n\nCRITERIA:\n{json.dumps(SCENARIO['criteria'], ensure_ascii=False)}\n\nEVIDENCE:\n{json.dumps(SCENARIO['actual_contributions'], ensure_ascii=False)}"""

    rules = run("rules", rules_prompt, RULE_SCHEMA, validate_rules)
    before = run("before", before_prompt, BEFORE_SCHEMA, validate_before)
    contribution = run("contribution", contrib_prompt, CONTRIB_SCHEMA, validate_contrib)
    objection = run_objection_batch(contribution["output"])
    all_runs = [rules, before, contribution, objection]
    summary = {
        "model": MODEL,
        "all_passed": all(r["passed"] for r in all_runs),
        "tests": [{"test":r["test"],"passed":r["passed"],"metrics":r["metrics"],"checks":r["checks"]} for r in all_runs]
    }
    (RESULTS / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2))
    print("\n=== GATE SUMMARY ===")
    print(json.dumps(summary, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
