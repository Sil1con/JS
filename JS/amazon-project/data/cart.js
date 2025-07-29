//import { updateCheckoutQuantity } from "../scripts/checkout.js";

export let cart = JSON.parse(localStorage.getItem('cart'));

function saveToCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addItemToCart(productID) {
    let repeatedItem = findMatchingProduct(productID);

    const selectedQuanity = Number(document.querySelector(`.js-select-quantity-${productID}`).value);

    if (repeatedItem) {
        repeatedItem.quantity += selectedQuanity;
    } else {
        cart.push({
            id: productID,
            quantity: selectedQuanity
        });
    }

    updateCartQuantity(checkCartItemsQuantity());
    saveToCart();
}

export function updateCartQuantity(amount) {
    const cartQuant = document.querySelector('.js-cart-quantity');

    if (amount === undefined) cartQuant.innerHTML = 0; 
    else cartQuant.innerHTML = amount;
}

export function checkCartItemsQuantity() {
    let itemsQuantity = 0;

    cart.forEach((item) => {
        itemsQuantity += item.quantity;
    });

    return itemsQuantity;
}

function findMatchingProduct(productID) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (cartItem.id === productID) matchingItem = cartItem;
    });

    return matchingItem;
}

function findMatchingProductIndex(productID) {
    let matchingItemIndex;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productID) matchingItemIndex = i;
    }

    return matchingItemIndex;
}

export function deleteItemFromCart(productID) {
    let mathcingItemIndex = findMatchingProductIndex(productID);

    if (mathcingItemIndex !== undefined) {
        cart.splice(mathcingItemIndex, 1);
    }

    //updateCheckoutQuantity();
    saveToCart();
}