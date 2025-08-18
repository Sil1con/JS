import { getDeliveryOption, returnDaysWithoutWeekends } from './delivery.js';

class Cart {
    cart;
    #localStorageKey;
    
    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }

    #loadFromStorage() {
        this.cart = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
    }

    saveToCart() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(cart));
    }

    addItemToCart(productID) {
        let repeatedItem = findMatchingCartItem(productID);

        const selectedQuanity = getItemQuanityToBeAdded();

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

    updateCartQuantity(amount) {
        const cartQuant = document.querySelector('.js-cart-quantity');

        if (amount === undefined) cartQuant.innerHTML = 0; 
        else if (cartQuant !== null) cartQuant.innerHTML = amount;
    }

    checkCartItemsQuantity() {
        let itemsQuantity = 0;

        cart.forEach((item) => {
            itemsQuantity += item.quantity;
        });

        return itemsQuantity;
    }

    findMatchingCartItem(productID) {
        let matchingItem;

        cart.forEach((cartItem) => {
            if (cartItem.id === productID) matchingItem = cartItem;
        });

        return matchingItem;
    }

    findMatchingProductIndex(productID) {
        let matchingItemIndex;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === productID) matchingItemIndex = i;
        }

        return matchingItemIndex;
    }

    updateItemDeliveryOption(itemID, newDeliveryOptionId) {
        let cartItem = findMatchingCartItem(itemID);
        
        if (cartItem.deliveryOptionId !== newDeliveryOptionId) {
            cartItem.deliveryOptionId = newDeliveryOptionId;
        }

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        const deliveryWithoutWeekends = returnDaysWithoutWeekends(deliveryOption.deliveryDays);
        const date = dayjs().add(deliveryWithoutWeekends, 'day').format('dddd, MMMM D');

        saveToCart();
        document.querySelector(`.js-delivery-date-${cartItem.id}`).innerHTML = `Delivery date: ${date}`;
    }

    getItemQuanityToBeAdded(productID) {
        const quantity = document.querySelector(`.js-select-quantity-${productID}`);
        if (quantity !== null) return quantity.value;
        else return 1; 
    }
}

export const cart = new Cart('cart');