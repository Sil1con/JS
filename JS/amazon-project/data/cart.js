const cart = [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1
    }
];

function addItemToCart(productID) {
    let repeatedItem;
    let itemsQuantity = 0;

    cart.forEach((item) => {
        itemsQuantity += item.quantity;
        if(productID === item.id) repeatedItem = item;
    });

    const selectedQuanity = Number(document.querySelector(`.js-select-quantity-${productID}`).value);

    if (repeatedItem) {
        repeatedItem.quantity += selectedQuanity;
    } else {
        cart.push({
            id: productID,
            quantity: selectedQuanity
        });
    }
    itemsQuantity += selectedQuanity;

    updateCartQuantity(itemsQuantity);
}

function updateCartQuantity(amount) {
    const cartQuant = document.querySelector('.js-cart-quantity');

    if (amount === undefined) cartQuant.innerHTML = 0; 
    else cartQuant.innerHTML = amount;
}

function checkCartItemsQuantity() {
    let itemsQuantity = 0;

    cart.forEach((item) => {
        itemsQuantity += item.quantity;
    });

    return itemsQuantity;
}