// data\cart.js
export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  let matching;
  let quantitySelector = document.querySelector(`.js-quantity-selector-${productId} select`);
  let quantityOptions = parseInt(quantitySelector.value);
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matching = cartItem;
    }
  });

  if (matching) {
    matching.quantity += quantityOptions;
  } else {
    cart.push({
      productId,
      quantity: quantityOptions,
      deliveryOptionsId: '1', 
    });
  }
  saveToStorage();
}

export function removeFromCart(productId) {
    let newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

export function updateQuantity(productId, newQunatity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQunatity;
    }
  })
  saveToStorage();
}


export function updateDeliveryOption(productId, deliveryOptionsId) {
  let matching;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matching = cartItem;
    }
  });
  matching.deliveryOptionsId = deliveryOptionsId;
  saveToStorage();
};

