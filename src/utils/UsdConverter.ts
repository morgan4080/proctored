export const UsdConverter = (centAmount: number) => {
  const dollarAmount = centAmount / 100
  return dollarAmount.toFixed(2)
}
