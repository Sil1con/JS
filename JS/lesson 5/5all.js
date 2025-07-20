const name = 'Vadim';
console.log(`My name is ${name}`);
const coffeePrice = 500;
const bagelPrice = 300;
const soupPrice = 900;

let cupAmount = 1;
let bagelAmount = 2;
let soupAmount = 1;

let cost = 0;
cost = ((coffeePrice * cupAmount) + (bagelPrice * bagelAmount) + (soupPrice + soupAmount));

console.log(`Your order:\n1. coffee: ${cupAmount} cups,\n2. bagel: ${bagelAmount} pieces\n3. soup: ${soupAmount} plates`)
console.log(`Total cost: ${cost}`)