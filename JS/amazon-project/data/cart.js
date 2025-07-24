const cart = [{name: 'Black and Gray Athletic Cotton Socks - 6 Pairs', quantity: 1}];

function addItemToCart(productName) {
    if (isItemInCart(productName)) {
        getByName(productName).quantity++;
        console.log(cart);
    } else {
        cart.push({
            name: productName,
            quantity: 1
        });
        console.log(cart);
        //cart.productName.quanity++;
    }
}

function isItemInCart(productName) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) return true;
    }
    return false;
}

function getByName(productName) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) return cart[i];
    }
    return undefined;
}