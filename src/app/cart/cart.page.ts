import { Component, OnInit } from '@angular/core';
import { Platform, MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AddressDataService } from '../services/address/address-data.service';
import { CartService } from '../services/cart/cart.service';
import { OrderDataService } from '../services/order/order-data.service';
import { ShowToastService } from '../services/toast/show-toast.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { VoucherService } from '../services/voucher/voucher.service';
import { LoadingService } from '../services/loading/loading.service';
import { WalletService } from '../services/wallet/wallet.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  count:any = 1;
  cartInfo:any = {};
  voucher:any = {};
  userInfo:any = {};
  userAddress:any = [];
  cartItems:any = [];
  selectedAddress:any = null;
  selectedAddressId:any = null;
  optional_note:any = null;
  promoCode:any = false;
  walletRedeemed:any = false;
  walletAmount:any = 0;
  public backButtonSubscription;
  constructor(private menuCtrl: MenuController, private router: Router, private orderService: OrderDataService, private loadingService: LoadingService,private platform: Platform,private walletService: WalletService,
    private cartService: CartService,private addressService: AddressDataService, private authService: AuthenticationService, private toastService: ShowToastService, private alertCtrl: AlertController, private voucherService: VoucherService) { }

  gotoDashboard(){
    this.router.navigate(['/dashboard']);    
  }

  gotoAddress(){
    this.router.navigate(['/address']);
  }

  incrementItem(item){
    
    item.quantity = item.quantity + item.measure_rate;
    
    if(item.measure_unit === 'Gm'){
      item.net_price = (item.unit_price * (item.quantity/50)).toFixed(0);
    }    
    else{
      item.net_price = (item.unit_price * item.quantity).toFixed(0);        
    }
    item.vat_amount += parseInt(item.unit_vat_amount);

    let total = this.cartItems
    .map(item => item.net_price)
    .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);

    this.cartInfo.subtotal = total;  

    let vat = this.cartItems
    .map(item => item.vat_amount)
    .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);

    this.cartInfo.vat = vat;
    
    this.cartInfo.total = total + JSON.parse(localStorage.getItem('cart')).delivery_fee + vat;

    this.cartService.updateCartItems(this.cartInfo,this.cartItems);
  }

  decrementItem(item){
    if(item.quantity > 0){

      item.quantity = item.quantity - item.measure_rate;

      if(item.measure_unit === 'Gm'){
        item.net_price = (item.unit_price * (item.quantity/50)).toFixed(0);
      }    
      else{
        item.net_price = (item.unit_price * item.quantity).toFixed(0);        
      }
      item.vat_amount -= parseInt(item.unit_vat_amount);

      // Remove item whose quantity is 0
      let currentCart = this.cartInfo;
      let currentCartItems = this.cartItems;
      let filtered = this.cartItems.filter(function(value, index){
          if (value.quantity == 0 && currentCartItems.filter((obj) => obj.vendor_id === value.vendor_id).length == 1) {
            currentCart.delivery_fee = currentCart.delivery_fee - value.delivery_fee;
          }
            return value.quantity > 0;
        });

        this.cartInfo.delivery_fee = currentCart.delivery_fee;

      this.cartItems = filtered;
      
      let total = this.cartItems
      .map(item => item.net_price)
      .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);

      let vat = this.cartItems
      .map(item => item.vat_amount)
      .reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0);
  
      this.cartInfo.vat = vat;
  
      this.cartInfo.subtotal = total;
      
      if (total <= 0) {
        this.cartInfo.delivery_fee = 0
      }

      this.cartInfo.total = total + this.cartInfo.delivery_fee + vat;
      this.cartService.updateCartItems(this.cartInfo,this.cartItems);
    
    }
  }

  async ConfirmPlaceOrder() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are you sure to place order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.placeOrder();
          }
        }
      ]
    });

    await alert.present();
  }

  redeemYourWallet(){
    this.walletAmount = 150;//JSON.parse(localStorage.getItem('auth_user')).user_wallet;
    if (this.walletAmount <= 0) {
      this.toastService.toast('No amount in your wallet');
    }
    else if(this.walletAmount >= this.cartInfo.total){
      this.walletAmount = this.cartInfo.total;
      this.walletRedeemed = true;
    }
    else{
      this.walletRedeemed = true;
    }
  }

  placeOrder(){
    this.loadingService.present();
    let cart:any = JSON.parse(localStorage.getItem('cart'));
    cart.address_id = parseInt(this.selectedAddressId);
    cart.note = (this.optional_note == '') ? null : this.optional_note;
    cart.wallet_redeem = this.walletAmount;

    if (this.promoCode == true) {
      cart.total = cart.total - this.voucher.amount;
      cart.promocode_fare = this.voucher.amount;
      cart.voucher_id = this.voucher.id;
    }
    
    this.orderService.placeOrder(cart).subscribe((data:any) => {
      if(data.success){
        this.toastService.toast(data.success);

        let authData = JSON.parse(localStorage.getItem('auth_user'));
        authData.user_wallet = authData.user_wallet - this.walletAmount;
        localStorage.setItem('auth_user',JSON.stringify(authData));

        localStorage.removeItem('cart');
        this.cartService.initializeCart();
        this.router.navigate(['/orders']);
        this.loadingService.dismiss();
      }
      else{
        this.toastService.toast(data.error);
      }
    }, err => { this.loadingService.dismiss(); });
  }

  async openAddressDropdown(){
    let addresses = JSON.parse(localStorage.getItem('user_address'));
    let inputs = [];
    addresses.forEach((obj) => {
      
      inputs.push({
        type : 'radio', 
        label : obj.house_num+' '+obj.street+' '+obj.area,
        value : obj.id,
      });
    });

    // For last option
    inputs.push({
      type : 'radio', 
      label : 'Add New Address',
      value : 'add_new',
    });
    
    const alert = await this.alertCtrl.create({
      header: 'Addresses',
      subHeader: 'Select Your Address',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if(data == 'add_new'){
              this.addAddress();
            }
            else if(data){
              let addSelect =  this.userAddress.filter(function(add) {
                return add.id == data;
              });
              this.selectedAddress = addSelect[0].house_num+' '+addSelect[0].street+' '+addSelect[0].area;
              this.selectedAddressId = addSelect[0].id;
            }
            
          }
        }
      ]
    });

    await alert.present();
  }

  async enterPromoCode(){
    const alert = await this.alertCtrl.create({
      header: 'Promo Code',
      inputs: [
        {
          name: 'voucher_code',
          type: 'text',
          placeholder: 'Promo Code'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'Apply',
          handler: (data) => {
            data.order_amount = this.cartInfo.subtotal;
            this.loadingService.present(); 
            this.voucherService.applyPromoCode(data).subscribe((data:any) => {
              if (data.error) {
                this.promoCodeError(data.error);
                this.promoCode = false;
              }
              else if(data.voucher.amount > this.cartInfo.total){
                this.promoCodeError("Insufficient order amount to avail promocode");
                this.promoCode = false;
              }
              else{
                this.voucher = data.voucher;
                this.promoCode = true;
              }
              this.loadingService.dismiss();
            }, err => { 
              
              this.loadingService.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // OPEN ADD ADDRESS MODAL
  async addAddress(){
    const alert = await this.alertCtrl.create({
      header: 'Add New Address',
      inputs: [
        {
          name: 'house_num',
          type: 'text',
          placeholder: 'Enter House Address'
        },
        {
          name: 'street',
          type: 'text',
          placeholder: 'Enter Street Name'
        },
        {
          name: 'area',
          type: 'text',
          placeholder: 'Enter Area Name'
        },
        {
          name: 'nearest_place',
          type: 'text',
          placeholder: 'Enter Nearest Place'
        },
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.loadingService.present(); 
            this.addressService.addAddress(data).subscribe((data:any) => {
              if(data.msg){

                // If address added get from db
                this.addressService.getAllAddresses().subscribe((data:any) => {
                  if(!data.msg){
                    localStorage.setItem('user_address',JSON.stringify(data.address));
                    this.userAddress = data.address;
                  }
                                
                }, err => { 
                  console.log('error found'); 
                });

                this.toastService.toast(data.msg);
                this.loadingService.dismiss();
              }
            }, err => { 
              let errors = [];
              let errorArray = Object.values(err.error.error);
      
              errorArray.forEach(elem => { errors.push(elem[0]); });
      
              this.toastService.toast(errors.join());
              this.loadingService.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    console.log('INIT');
    this.menuCtrl.enable(true);
    let cart:any = JSON.parse(localStorage.getItem('cart'));
    
    this.cartItems = cart.orderItems;
    this.cartInfo.vat = cart.vat;
    this.cartInfo.subtotal = cart.subtotal;
    this.cartInfo.total = cart.total;
    this.cartInfo.delivery_fee = cart.delivery_fee;    

    if(localStorage.getItem('user_info')){
      this.userInfo = JSON.parse(localStorage.getItem('user_info'));      
    }
    else{
      this.authService.getUserInfo();
      this.userInfo = JSON.parse(localStorage.getItem('user_info'));
    }

    this.userAddress = (localStorage.getItem('user_address')) ? JSON.parse(localStorage.getItem('user_address')) : [];
    this.selectedAddress = this.userAddress[0].house_num+' '+this.userAddress[0].street+' '+this.userAddress[0].area;
    this.selectedAddressId = this.userAddress[0].id;
    
    if (JSON.parse(localStorage.getItem('user_address')).length <= 0) {
      this.showAddressNotification();
    }

    this.walletService.getWalletAmount().subscribe((data:any) => {
      let authUser = JSON.parse(localStorage.getItem('auth_user'));
      this.walletAmount = data.wallet_amount;
      authUser.user_wallet = data.wallet_amount;
      localStorage.setItem('auth_user',JSON.stringify(authUser));
    }, err => {  });

    // Subscribe to back button
    // this.platform.backButton.subscribe(() => {
    //   this.gotoDashboard();
    // });
  }

  ngOnDestroy(){
    // this.platform.backButton.unsubscribe();
  }

  async showAddressNotification(){
    const alert = await this.alertCtrl.create({
      header: 'Alert!',
      message: 'Please enter your address first to proceed',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Enter Address',
          handler: () => {
            this.gotoAddress();
          }
        }
      ]
    });

    await alert.present();
  }

  async promoCodeError(errorMsg) {
    const alert = await this.alertCtrl.create({
      header: 'Promocode!',
      message: errorMsg,
      buttons: ['Close']
    });

    await alert.present();
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {   
      this.router.navigate(['dashboard']);
    });
   }

   ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
   }

  ionViewWillEnter() {
      this.menuCtrl.enable(true);
      let cart:any = JSON.parse(localStorage.getItem('cart'));
      
      this.cartItems = cart.orderItems;
      this.cartInfo.vat = cart.vat;
      this.cartInfo.subtotal = cart.subtotal;
      this.cartInfo.total = cart.total;
      this.cartInfo.delivery_fee = cart.delivery_fee;
  }

}
