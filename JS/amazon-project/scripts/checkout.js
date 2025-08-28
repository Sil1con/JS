import { cart, checkCartItemsQuantity, findMatchingCartItem, findMatchingProductIndex, saveToCart, updateItemDeliveryOption, loadCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utilities/money.js';
import { deliveryOptions, getDeliveryOption, returnDaysWithoutWeekends } from '../data/delivery.js';

Promise.all([
    new Promise((resolve) => {
        loadProducts(() => {
            resolve();
        });
    }),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then(() => {
    updateCart();
    updateCheckoutQuantity();
    setAllListeners();
});

// loadProducts(() => {
//     updateCart();
//     updateCheckoutQuantity();
//     setAllListeners();
// });

function setAllListeners() {
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

    document.querySelectorAll('.delivery-option-input').forEach((option) => {
        option.addEventListener('click', () => {
            const deliveryID = option.dataset.deliveryId;
            const itemID = option.dataset.productId;

            updateItemDeliveryOption(itemID, deliveryID);
            updateOrderSummary();
        });
    });
}

function updateCart() {
    let cartHTML = '';
    
    cart.forEach((cartItem) => {
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const deliveryDaysWithoutWeekends = returnDaysWithoutWeekends(deliveryOption.deliveryDays);
        const date = dayjs().add(deliveryDaysWithoutWeekends, 'day').format('dddd, MMMM D');

        let matchingProduct = findMatchingProduct(cartItem.id);

        cartHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date js-delivery-date-${matchingProduct.id}">
                    Delivery date: ${date}
                </div>
                <div class="cart-item-details-grid">
                    <img class="product-image" src="${matchingProduct.image}">
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                            $${formatCurrency(matchingProduct.priceCents)}
                        </div>
                        <div class="product-quantity">
                            <span>
                                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                                Update
                            </span>
                            <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                                Save
                            </span>
                            <span class="delete-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                                Delete
                            </span>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        <div class="delivery-options-grid">
                            ${addDeliveryOptions(cartItem)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    document.querySelector('.js-order-summary').innerHTML = cartHTML;
}

function addDeliveryOptions(cartItem) {
    let optionsHTML = '';
    
    deliveryOptions.forEach((deliveryOption) => {
        const deliveryDaysWithoutWeekends = returnDaysWithoutWeekends(deliveryOption.deliveryDays);
        const deliveryDate = dayjs().add(deliveryDaysWithoutWeekends, 'day');
        const dayStr = deliveryDate.format('dddd, MMMM D');
        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        optionsHTML += `
            <div class="delivery-option js-delivery-option">
                
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" 
                    name="delivery-option-${cartItem.id}"
                    data-product-id="${cartItem.id}"
                    data-delivery-id="${deliveryOption.id}"
                >
                <div>
                    <div class="delivery-option-date">
                        ${dayStr}
                    </div>
                    <div class="delivery-option-price">
                        $${formatCurrency(deliveryOption.priceCents)} - Shipping
                    </div>
                </div>
            </div>
        `;
    });
    return optionsHTML;
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

export function updateOrderSummary() {
    if (cart.length === 0) annulOrderSummary();
    else if (cart.length !== 0) calculateOrderSummary();
}

function calculateOrderSummary() {
    const taxCoef = 0.1;
    
    let shippingPrice = 0;
    let itemsQuantity = 0;
    let itemsPrice = 0;

    cart.forEach((cartItem) => {
        let matchingItem = findMatchingProduct(cartItem.id);
        shippingPrice += getDeliveryOption(cartItem.deliveryOptionId).priceCents;
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