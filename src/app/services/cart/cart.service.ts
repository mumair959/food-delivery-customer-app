import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  initializeCart(){
    if(!localStorage.getItem('cart')){
      let cart:any = {subtotal:0,total:0,vat:0,delivery_fee:0,itemsCount:0,orderItems:[]};
      localStorage.setItem('cart',JSON.stringify(cart));
    }
  }

  async addItemToCart(item){
    
    let cart:any = JSON.parse(localStorage.getItem('cart'));

    let vendorExists = cart.orderItems.filter((val) => {
      return val.vendor_id == item.vendor_id;
    });

    if (vendorExists.length == 0) {
      cart.delivery_fee = cart.delivery_fee + parseInt(item.delivery_charges);
    }
    cart.vat = cart.vat + parseInt(item.vat);

    let cartIndex = cart.orderItems.findIndex((obj => obj.product_id == item.id));
    // If product already exist then just update quantity
    if(cartIndex > -1){
      if(item.measure_unit === 'Gm'){
        cart.orderItems[cartIndex].quantity += 50;
      }
      else{
        cart.orderItems[cartIndex].quantity++;
      }

      cart.orderItems[cartIndex].net_price = (cart.orderItems[cartIndex].quantity * cart.orderItems[cartIndex].unit_price).toFixed(0);
      cart.subtotal += parseInt(cart.orderItems[cartIndex].unit_price);
    }
    // otherwise add as new one
    else{
      let orderItem:any = {};
      orderItem.product_id = item.id;
      orderItem.vendor_id = parseInt(item.vendor_id);
      orderItem.name = item.name;
      orderItem.delivery_fee = parseInt(item.delivery_charges);
      orderItem.vat = item.vat_percent;
      orderItem.vat_amount = (parseInt(item.net_price)/100)*parseInt(item.vat_percent);
      orderItem.unit_vat_amount = (parseInt(item.net_price)/100)*parseInt(item.vat_percent);      
      orderItem.description = item.description;
      orderItem.measure_rate = parseFloat(item.measure_rate);
      orderItem.measure_unit = (item.measure_unit === 'null') ? null : item.measure_unit;
      orderItem.unit_price = parseInt(item.net_price);
      orderItem.net_price = parseInt(item.net_price);    
      
      if(item.measure_unit === 'Gm'){
        orderItem.quantity = 50;
      }
      else{
        orderItem.quantity = 1;
      }

      cart.itemsCount++;
      cart.orderItems.push(orderItem);
      cart.subtotal += parseInt(item.net_price);
    }
    
    cart.total = cart.subtotal + parseInt(cart.delivery_fee) + parseInt(cart.vat);

    return await localStorage.setItem('cart',JSON.stringify(cart));
  }

  async addItemWithVariantsToCart(product,variants){

    let cart:any = JSON.parse(localStorage.getItem('cart'));

    let vendorExists = cart.orderItems.filter((val) => {
      return val.vendor_id == product.vendor_id;
    });

    if (vendorExists.length == 0) {
      cart.delivery_fee = cart.delivery_fee + parseInt(product.delivery_charges);
    }
    cart.vat = cart.vat + parseInt(product.vat);

    let cartIndex = cart.orderItems.findIndex((obj => obj.product_id == product.id && obj.product_variant_id == variants.id));
    // If product already exist then just update quantity
    if(cartIndex > -1){
      if(product.measure_unit == 'Gm'){
        cart.orderItems[cartIndex].quantity += 50;
      }
      else{
        cart.orderItems[cartIndex].quantity++;
      }
      
      cart.orderItems[cartIndex].net_price = (cart.orderItems[cartIndex].quantity * cart.orderItems[cartIndex].unit_price).toFixed(0);
      cart.subtotal += parseInt(cart.orderItems[cartIndex].unit_price);
      
    }
    // otherwise add as new one
    else{
    let orderItem:any = {};
    orderItem.product_id = parseInt(product.id);
    orderItem.vendor_id = parseInt(product.vendor_id);
    orderItem.vat = product.vat_percent;
    orderItem.vat_amount = (parseInt(product.net_price)/100)*parseInt(product.vat_percent);
    orderItem.unit_vat_amount = (parseInt(product.net_price)/100)*parseInt(product.vat_percent);
    orderItem.product_variant_id = variants.id;
    orderItem.variant_1 = variants.variant_val_1;
    orderItem.variant_2 = variants.variant_val_2;
    orderItem.variant_3 = variants.variant_val_3;
    orderItem.name = product.name;
    orderItem.measure_rate = parseFloat(product.measure_rate);
    orderItem.measure_unit = (product.measure_unit === 'null') ? null : product.measure_unit;
    orderItem.unit_price = parseInt(variants.net_price);
    orderItem.net_price = parseInt(variants.net_price); 
    
    if(product.measure_unit == 'Gm'){
      orderItem.quantity = 50;
    }
    else{
      orderItem.quantity = 1;
    }

    cart.itemsCount++;
    cart.orderItems.push(orderItem);

    cart.subtotal += parseInt(variants.net_price);
    }

    cart.total = cart.subtotal + cart.delivery_fee;
    

    return await localStorage.setItem('cart',JSON.stringify(cart));
    
  }

  updateCartItems(cartInfo,cartItems){
    let cart:any = JSON.parse(localStorage.getItem('cart'));

    cart.subtotal = parseInt(cartInfo.subtotal);
    cart.total = parseInt(cartInfo.subtotal + cartInfo.delivery_fee + cartInfo.vat);
    cart.delivery_fee = cartInfo.delivery_fee;
    cart.vat = cartInfo.vat;
    cart.itemsCount = cartItems.length;
    cart.orderItems = cartItems;

    localStorage.setItem('cart',JSON.stringify(cart));
  }

  
}
