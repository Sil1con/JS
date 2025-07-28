export const cart = [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1
    },
    {
        id: "54e0eccd-8f36-462b-b68a-8182611d9add",
        quantity: 2
    }
];

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

export function deleteItemFromCart(productID) {

}