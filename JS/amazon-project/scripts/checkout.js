import { cart, checkCartItemsQuantity, findMatchingCartItem, findMatchingProductIndex, saveToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utilities/money.js';

updateCart();
updateCheckoutQuantity();

document.querySelectorAll('.update-quantity-link').forEach((update) => {
    update.addEventListener('click', () => {
        const itemID = update.dataset.productId;
        document.querySelector(`.js-cart-item-container-${itemID}`).classList.add('is-editing-quantity');
    });
});

document.querySelectorAll('.save-quantity-link').forEach((save) => {
    save.addEventListener('click', () => {        
        const itemID = save.dataset.productId;
        const updatedItemQuantity = Number(document.querySelector(`.js-quantity-input-${itemID}`).value);
        
        document.querySelector(`.js-cart-item-container-${itemID}`).classList.remove('is-editing-quantity');

        updateItemQuantity(itemID, updatedItemQuantity);
    });
});

document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const itemID = input.dataset.productId;
            const updatedItemQuantity = Number(document.querySelector(`.js-quantity-input-${itemID}`).value);
            
            document.querySelector(`.js-cart-item-container-${itemID}`).classList.remove('is-editing-quantity');

            updateItemQuantity(itemID, updatedItemQuantity);
        }
    });
});

document.querySelectorAll('.delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const itemID = link.dataset.productId;
        deleteItemFromCart(itemID);
        
        removeItemContainer(itemID);
        updateOrderSummary();
    });
});

function updateCart() {
    let cartHTML = '';
    cart.forEach((cartItem) => {
        let matchingItem = findMatchingProduct(cartItem.id);
        cartHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
                <div class="delivery-date">
                Delivery date: Tuesday, June 21
                </div>

                <div class="cart-item-details-grid">
                <img class="product-image"
                    src="${matchingItem.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingItem.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingItem.priceCents)}
                    </div>
                    <div class="product-quantity">
                    <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary" data-product-id="${matchingItem.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingItem.id}" data-product-id="${matchingItem.id}">
                    <span class="save-quantity-link link-primary" data-product-id="${matchingItem.id}">
                        Save
                    </span>
                    <span class="delete-quantity-link link-primary" data-product-id="${matchingItem.id}">
                        Delete
                    </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                    Choose a delivery option:
                    </div>
                    <div class="delivery-option">
                    <input type="radio" checked
                        class="delivery-option-input"
                        name="delivery-option-${cartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                        Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                        FREE Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${cartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                        Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                        $4.99 - Shipping
                        </div>
                    </div>
                    </div>
                    <div class="delivery-option">
                    <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${cartItem.id}">
                    <div>
                        <div class="delivery-option-date">
                        Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                        $9.99 - Shipping
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        `
    });
    document.querySelector('.js-order-summary').innerHTML = cartHTML;
}

function removeItemContainer(itemID) {
    deleteItemFromCart(itemID);
    const container = document.querySelector(`.js-cart-item-container-${itemID}`);
    container.remove();
}

function updateItemQuantity(itemID, newQuantity) {
    let itemQuantity;

    if (newQuantity === 0) removeItemContainer(itemID);
    else if (newQuantity >= 100) itemQuantity = 100;
    else itemQuantity = newQuantity; 

    findMatchingCartItem(itemID).quantity = itemQuantity;
    document.querySelector(`.js-quantity-input-${itemID}`).value = '';
    document.querySelector(`.js-quantity-label-${itemID}`).innerHTML = itemQuantity;
    updateCheckoutQuantity();
    saveToCart();
}

function updateOrderSummary() {
    if (cart.length === 0) annulOrderSummary();
    else if (cart.length !== 0) calculateOrderSummary();
}

function calculateOrderSummary() {
    const shippingPrice = 499;
    const taxCoef = 0.1;
    
    let itemsQuantity = 0;
    let itemsPrice = 0;

    cart.forEach((cartItem) => {
        let matchingItem = findMatchingProduct(cartItem.id);
        itemsPrice += matchingItem.priceCents * cartItem.quantity;
        itemsQuantity += cartItem.quantity;
    });

    let totalBeforeTax = itemsPrice + shippingPrice;
    let estimatedTax = Math.floor(totalBeforeTax * taxCoef);
    let totalToBePaid = totalBeforeTax + estimatedTax;

    showOrderSummary(itemsQuantity, itemsPrice, shippingPrice, totalBeforeTax, estimatedTax, totalToBePaid);
}

function showOrderSummary(itemsQuantity, itemsPrice, shippingPrice, totalBeforeTax, estimatedTax, totalToBePaid) {
    document.querySelector('.js-payment-items').innerHTML = `Items (${itemsQuantity}):`;
    document.querySelector('.js-payment-items-price').innerHTML = `$${formatCurrency(itemsPrice)}`;
    document.querySelector('.js-shipping-price').innerHTML = `$${formatCurrency(shippingPrice)}`;
    document.querySelector('.js-total-before-tax').innerHTML = `$${formatCurrency(totalBeforeTax)}`;
    document.querySelector('.js-estimated-tax').innerHTML = `$${formatCurrency(estimatedTax)}`;
    document.querySelector('.js-order-total').innerHTML = `$${formatCurrency(totalToBePaid)}`;
}

function annulOrderSummary() {
    document.querySelector('.js-payment-items').innerHTML = `Items (${0}):`
    document.querySelector('.js-payment-items-price').innerHTML = `$${formatCurrency(0)}`;
    document.querySelector('.js-shipping-price').innerHTML = `$${formatCurrency(0)}`;
    document.querySelector('.js-total-before-tax').innerHTML = `$${formatCurrency(0)}`;
    document.querySelector('.js-estimated-tax').innerHTML = `$${formatCurrency(0)}`;
    document.querySelector('.js-order-total').innerHTML = `$${formatCurrency(0)}`;
}
 
function findMatchingProduct(cartItemID) {
    let matchingItem;

    products.forEach((productItem) => {
        if (cartItemID === productItem.id) {
            matchingItem = productItem;  
        } 
    });

    return matchingItem;
}

function deleteItemFromCart(cartItemID) {
    let mathcingItemIndex = findMatchingProductIndex(cartItemID);

    if (mathcingItemIndex !== undefined) {
        cart.splice(mathcingItemIndex, 1);
    }

    updateCheckoutQuantity();
    saveToCart();
}

export function updateCheckoutQuantity() {
    const checkoutLink = document.querySelector('.js-return-to-home-link');
    const quantity = checkCartItemsQuantity();

    if (quantity === 0) checkoutLink.innerHTML = 'empty';
    else if (quantity === 1) checkoutLink.innerHTML = '1 item';
    else checkoutLink.innerHTML = `${quantity} items`;

    updateOrderSummary();
}