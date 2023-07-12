import { Component, OnInit } from '@angular/core';
import { Platform, MenuController, AlertController } from '@ionic/angular';
import { ActivatedRoute,Router,NavigationExtras } from '@angular/router';

import  { VendorDataService } from '../services/vendor/vendor-data.service';
import { LoadingService } from '../services/loading/loading.service';
import { ShowToastService } from '../services/toast/show-toast.service';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public vendor:any = {};
  public withoutVendor:any = {};
  public categories:any = [];
  public menus:any = [];
  public cartCount:any;
  public categoryWithVendor:any = [3];
  public backButtonSubscription;
  constructor(private route: ActivatedRoute,private router: Router, private loadingService: LoadingService, private showToast: ShowToastService, private alertCtrl: AlertController,
    private menuCtrl: MenuController,private vendorService: VendorDataService,private cartService: CartService,private platform: Platform) {
      this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
    }

  async ConfirmAddToCart(menu) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Add this item to cart?',
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
            this.addToCart(menu);
          }
        }
      ]
    });

    await alert.present();
  }

  addToCart(menu){
    // Check delivery charges for product without vendors
    if (this.vendor.delivery_charges == undefined) {
      menu.delivery_charges = 0;      
    } else {
      menu.delivery_charges = this.vendor.delivery_charges;    
    }

    // Check vat for product without vendors
    if (this.vendor.vat == undefined) {
      menu.vat = 0; 
      menu.vat_percent = 0;      
    } else {
      menu.vat = menu.net_price*(this.vendor.vat/100);
      menu.vat_percent = this.vendor.vat;  
    }

    if(menu.has_variants === '1'){
      let menuArray:any = [];
      menu.product_variants.forEach(function (val, index) {
        menuArray.push(JSON.stringify(val));
      });

      menu.product_variants = menuArray;
      menu.measure_unit = JSON.stringify(menu.measure_unit);

      let navigationExtras: NavigationExtras = {
        queryParams: menu
    };
      this.router.navigate(['customize'],navigationExtras);            
    }
    else{
      this.cartService.addItemToCart(menu).then((result) => {
        this.showToast.toast('Item added to cart');
        console.log(JSON.parse(localStorage.getItem('cart')));
        this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
        // this.router.navigateByUrl('/cart'); 
      }).catch((err) => { });     
    }
  }

  goToCart(){
    this.router.navigate(['cart']);
  }

  changeMenu(category){
    let vendorId:any;
    this.loadingService.present();  
    this.menus = [];

    if(this.vendor.id){
      vendorId = this.vendor.id;
    }
    else{
      vendorId = this.withoutVendor.vend_id;
    }
    this.vendorService.getMenu(vendorId,category.id).subscribe((data:any) => {
      
      this.menus = data.menu;
      this.loadingService.dismiss();
    }, err => { this.loadingService.dismiss();  });
  }

  goBack(){
    if(Object.keys(this.withoutVendor).length !== 0){
      this.router.navigate(['dashboard']);
    }
    else{
      let vend:any = {};
      vend.id = this.vendor.category_id;   
      let navigationExtras: NavigationExtras = {
        queryParams: vend
      };
  
      this.router.navigate(['home'],navigationExtras);
    }
  }

  ngOnInit() {
    this.loadingService.present();  
    this.menuCtrl.enable(true); 

    this.route.queryParams.subscribe(params => {
      if(params.venderType === 'without vendor'){
        this.withoutVendor = params;

        // First get vendor detail
        this.vendorService.getVendors(params.id).subscribe((vend:any) => {
          
          // Now get its menu
          this.vendorService.getVendorMenu(vend.vendors[0].id).subscribe((data:any) => {
            this.categories = data.category;
            this.menus = data.menu;
            this.withoutVendor = Object.assign({}, this.withoutVendor, { vend_id : vend.vendors[0].id });
            this.loadingService.dismiss(); 
          }, err => { this.loadingService.dismiss(); });
          
        }, err => { });
      }
      else{
        this.vendor = params;
        this.vendorService.getVendorMenu(params.id).subscribe((data:any) => {
          this.categories = data.category;
          this.menus = data.menu;
          this.loadingService.dismiss(); 
        }, err => { this.loadingService.dismiss(); });
      }
      
    });
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {   
      this.router.navigate(['dashboard']);
    });
   }

   ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
   }

}
