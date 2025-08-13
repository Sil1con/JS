export function formatCurrency(priceCents) {
    if (priceCents < 0) return null;
    else return (Math.round(priceCents) / 100).toFixed(2);
}