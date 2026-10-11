export function amountFromPercent(poolCny: number, percent: number) {
  return (poolCny * percent) / 100;
}

export function formatCny(amount: number) {
  return `¥${amount.toLocaleString('en-US')}`;
}
