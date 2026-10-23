import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, createExport } from '../src/allocation/allocation';
const input = (prize: string, scores: string[]) => ({ prize, members: scores.map((score,i) => ({ id: String(i), name: `Member ${i+1}`, score })) });
test('normal shares', () => assert.deepEqual(calculate(input('12000', ['3','2','1'])).members.map(m => m.amountCents), [600000,400000,200000]));
test('largest remainder and list-order ties', () => {
 for(const [prize,expected] of [['100.00',[3334,3333,3333]],['0.01',[1,0,0]],['0.02',[1,1,0]]] as const) assert.deepEqual(calculate(input(prize,['1','1','1'])).members.map(m=>m.amountCents),expected);
 const data=input('0.07',['1','2','3']);assert.deepEqual(calculate(data).members.map(m=>m.amountCents),[1,2,4]);assert.deepEqual(calculate(data),calculate(data));
});
test('zero scores receive zero; all zero rejected', () => {
 assert.deepEqual(calculate(input('100',['0','1','1'])).members.map(m=>m.amountCents),[0,5000,5000]);
 assert.throws(()=>calculate(input('1',['0','0'])),/Total score/);
});
test('illegal prize and score strings; upper and lower bounds', () => {
 for(const value of ['', '0','-1','+1','1.001','1e3','NaN','Infinity','1,000',' 1','1 ','1000000.01','1000001','01','1.']) assert.throws(()=>calculate(input(value,['1'])),undefined,value);
 for(const value of ['', '-1','+1','1.2','1e3','NaN','Infinity','1000001','01',' 1']) assert.throws(()=>calculate(input('1',[value])),undefined,value);
 assert.equal(calculate(input('1000000.00',['1000000'])).prizeCents,100000000);
});
test('names, IDs and member count', () => {
 assert.throws(()=>calculate(input('1',[]))); assert.throws(()=>calculate(input('1',Array(21).fill('1'))));
 const data=input('1',['1','1']);
 for(const name of [' ','x'.repeat(61),' MEMBER 2 ']){data.members[0].name=name;assert.throws(()=>calculate(data));}
 data.members[0].name='Alex';data.members[0].id='1';assert.throws(()=>calculate(data));
});
test('before/after JSON is reproducible; stale or tampered export blocked', () => {
 const before=input('100',['1','1','1']),after=input('100',['1','2','1']);
 const previous={inputs:before,result:calculate(before)},current={inputs:after,result:calculate(after)};
 const payload=JSON.parse(JSON.stringify(createExport(current,previous,after,false)));
 assert.deepEqual(payload.current.result.members.map((m:any)=>m.amountCents),[2500,5000,2500]);
 assert.deepEqual(payload.previous.result.members.map((m:any)=>m.amountCents),[3334,3333,3333]);
 assert.deepEqual(calculate(payload.current.inputs),payload.current.result);
 assert.equal(payload.rule.tieBreak,'member-list-order');assert.equal(payload.currency,'CNY');
 assert.throws(()=>createExport(current,previous,after,true));assert.throws(()=>createExport(current,previous,before,false));
 assert.throws(()=>createExport({...current,result:{...current.result,prizeCents:1}},previous,after,false));
});
test('5000 seeded allocations conserve cents and obey quotas', () => {
 let seed=42;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
 for(let k=0;k<5000;k++){
 const n=1+rand()%20,scores=Array.from({length:n},()=>String(rand()%1000001));scores[0]='1000000';if(n>1)scores[n-1]='0';
 const cents=1+rand()%100000000,data=input(`${Math.floor(cents/100)}.${String(cents%100).padStart(2,'0')}`,scores),r=calculate(data);
 assert.equal(r.members.reduce((s,m)=>s+m.amountCents,0),cents);
 for(const m of r.members){assert.ok(m.amountCents>=0);if(m.score===0)assert.equal(m.amountCents,0);assert.ok(m.amountCents===m.baseCents||m.amountCents===m.baseCents+1);}
 }
});
