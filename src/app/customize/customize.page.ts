import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute,Router,NavigationExtras  } from '@angular/router';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-customize',
  templateUrl: './customize.page.html',
  styleUrls: ['./customize.page.scss'],
})
export class CustomizePage implements OnInit {
  productInfo:any = {};
  productVariants:any = [];
  productVariant1:any = [];
  productVariant2:any = [];
  productVariant3:any = [];
  cartBtn:any = true;

  variant_1_val:any = null;
  variant_2_val:any = null;
  variant_3_val:any = null;
  
  constructor(private menuCtrl: MenuController,private route: ActivatedRoute,
    private router: Router,private cartService: CartService) { }

  selectVariant1(variant1){
    this.variant_1_val = variant1;

    if(!this.productInfo.variant_2 && !this.productInfo.variant_3){
      this.cartBtn = false;
    }
  }

  selectVariant2(variant2){
    this.variant_2_val = variant2;

    if(!this.productInfo.variant_3){
      this.cartBtn = false;      
    }
  }

  selectVariant3(variant3){
    this.variant_3_val = variant3;
    this.cartBtn = false;    
  }

  initializeVariants(variants){
    // Distint value for variant 1
    let map1 = new Map();
    for (let item of variants) {
        if(!map1.has(item.variant_val_1)){
            map1.set(item.variant_val_1, true);    // set any value to Map
            this.productVariant1.push({
                id: item.id,
                net_price: item.net_price,
                price: item.price,
                discount: item.discount,                
                product_id: item.product_id,
                variant_val_1: item.variant_val_1,
                variant_val_2: item.variant_val_3,
                variant_val_3: item.variant_val_3,
            });
        }
    }

    // Distint value for variant 2
    let map2 = new Map();
    for (let item of variants) {
        if(!map2.has(item.variant_val_2)){
            map2.set(item.variant_val_2, true);    // set any value to Map
            this.productVariant2.push({
                id: item.id,
                net_price: item.net_price,
                product_id: item.product_id,
                variant_val_1: item.variant_val_1,
                variant_val_2: item.variant_val_2,
                variant_val_3: item.variant_val_3,
            });
        }
    }

    // Distint value for variant 3      
    let map3 = new Map();
    for (let item of variants) {
        if(!map3.has(item.variant_val_3)){
            map3.set(item.variant_val_3, true);    // set any value to Map
            this.productVariant3.push({
                id: item.id,
                net_price: item.net_price,
                product_id: item.product_id,
                variant_val_1: item.variant_val_1,
                variant_val_2: item.variant_val_2,
                variant_val_3: item.variant_val_3,
            });
        }
    }
  }

  addToCart(){
    let result = this.productVariants.find(obj => {
      return (obj.variant_val_1 === this.variant_1_val && obj.variant_val_2 === this.variant_2_val && obj.variant_val_3 === this.variant_3_val)
    });

    this.cartService.addItemWithVariantsToCart(this.productInfo,result).then((result) => {
      this.router.navigate(['cart']);
    }).catch((err) => { });
  }

  ngOnInit() {
    this.menuCtrl.enable(true); 
    
    this.route.queryParams.subscribe(params => {
      this.productInfo = params;    
      let variants:any = []; 
      params.product_variants.forEach(function (val, index) {
        variants.push(JSON.parse(val));
      });
      this.productVariants = variants;
      this.initializeVariants(variants);
 
    });
  }

}
