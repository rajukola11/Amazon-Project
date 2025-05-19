// scripts\checkout\orderSummary.js
import { cart ,removeFromCart,updateQuantity,updateDeliveryOption } from '../../data/cart.js';
import { products , getProduct} from '../../data/products.js';
import { formatCurrency }  from '../utils/formatCurrency.js';
import {updateCartQuantity} from '../amazon.js'
import  dayjs  from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions ,getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
      let productId = cartItem.productId;

      const matchingProduct = getProduct(productId);

      const deliveryOptionId = cartItem.deliveryOptionsId;

      let deliveryOption = getDeliveryOption(deliveryOptionId);

      
      const today = dayjs();
      // const deliveryDate = today.add(deliveryOption.deviveryDays, 'days');
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');


      cartSummaryHTML += `
          <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image"
                  src='${matchingProduct.image}'>

                <div class="cart-item-details">
                  <div class="product-name">
                      ${matchingProduct.name}
                  </div>
                  <div class="product-price">
                    ${(formatCurrency(matchingProduct.priceCents))}
                  </div>
                  <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                      Update
                    </span>
                    <input class = 'quantity-input' value="${cartItem.quantity}"> 
                    <span class='save-quantity-link link-primary' data-product-id="${matchingProduct.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHTML(matchingProduct,cartItem)}
                </div>
              </div>
            </div>
      `;
  });

  function deliveryOptionsHTML(matchingProduct,cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      // const deliveryDate = today.add(deliveryOption.deviveryDays, 'days');
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionsId ? 'checked' : '';
      html += `
        <div class="delivery-option js-delivery-option" 
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
        </div>
      `
    })
    return html;

  }


  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      updateCartQuantity();
      renderPaymentSummary()
    })
  });


  updateCartQuantity();

  document.querySelectorAll('.js-update-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    })
  })

  document.querySelectorAll('.save-quantity-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      saveQuantity(productId);
    })
  });

  document.querySelectorAll('.save-quantity-link').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        console.log('Enter pressed', input);
        const productId = input.closest('.cart-item-container').querySelector('.save-quantity-link').dataset.productId;
        saveQuantity(productId);
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  });


  function saveQuantity(productId) {
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      const quantityInput = container.querySelector('.quantity-input');
      const quantityLabel = container.querySelector('.quantity-label');
      const newQuantity = parseInt(quantityInput.value);
      // validate the quantity b/w 1 and 10
      if (newQuantity < 1 || newQuantity > 10) {
        alert('Please select  quantity between 1 and 10');
        return;
      }

      updateQuantity(productId, newQuantity);
      quantityLabel.innerText = newQuantity;

      container.classList.remove('is-editing-quantity');
      updateCartQuantity();
  }
}
