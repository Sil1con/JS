import { getDeliveryOption } from './delivery.js';
import { updateOrderSummary } from '../scripts/checkout.js';

export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function  saveToCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addItemToCart(productID) {
    let repeatedItem = findMatchingCartItem(productID);

    const selectedQuanity = Number(document.querySelector(`.js-select-quantity-${productID}`).value);

    if (repeatedItem) {
        repeatedItem.quantity += selectedQuanity;
    } else {
        cart.push({
            id: productID,
            quantity: selectedQuanity,
            deliveryOptionId: '1'
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

export function findMatchingCartItem(productID) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (cartItem.id === productID) matchingItem = cartItem;
    });

    return matchingItem;
}

export function findMatchingProductIndex(productID) {
    let matchingItemIndex;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productID) matchingItemIndex = i;
    }

    return matchingItemIndex;
}

export function updateItemDeliveryOption(itemID, newDeliveryOptionId) {
    let cartItem = findMatchingCartItem(itemID);
    
    if (cartItem.deliveryOptionId !== newDeliveryOptionId) {
        cartItem.deliveryOptionId = newDeliveryOptionId;
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const date = dayjs().add(deliveryOption.deliveryDays, 'day').format('dddd, MMMM D');

    saveToCart();
    document.querySelector(`.js-delivery-date-${cartItem.id}`).innerHTML = `Delivery date: ${date}`;
}