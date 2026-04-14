export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatScore(score: number): string {
  return `${(score * 100).toFixed(0)}`;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function getScoreColor(score: number): string {
  if (score >= 0.8) return "text-green-600";
  if (score >= 0.6) return "text-orange-500";
  if (score >= 0.4) return "text-amber-500";
  return "text-red-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 0.8) return "bg-green-100 text-green-700";
  if (score >= 0.6) return "bg-orange-100 text-orange-700";
  if (score >= 0.4) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}
