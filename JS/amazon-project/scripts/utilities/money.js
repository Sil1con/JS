export function formatCurrency(priceCents) {
    if (priceCents < 0) return null;
    else return (priceCents / 100).toFixed(2);
}