const cart = [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        image: "images/products/athletic-cotton-socks-6-pairs.jpg",
        id: "Black and Gray Athletic Cotton Socks - 6 Pairs",
        quantity: 1
    }
];

function addItemToCart(productID) {
    let repeatedItem;

    cart.forEach((item) => {
        if(productID === item.id) repeatedItem = item;
    });

    if (repeatedItem) {
        repeatedItem.quantity++;
        console.log(cart);
    } else {
        cart.push({
            id: productID,
            quantity: 1
        });
        console.log(cart);
    }
}