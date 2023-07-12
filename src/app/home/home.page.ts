import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute,Router,NavigationExtras  } from '@angular/router';

import { ShowToastService } from '../services/toast/show-toast.service';
import  { VendorDataService } from '../services/vendor/vendor-data.service';
import { LoadingService } from '../services/loading/loading.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public vendors:any = [];
  public filteredVendors:any = [];
  public cartCount:any;
  public searchTerm:any;
  constructor(private route: ActivatedRoute,private router: Router,private menuCtrl: MenuController, 
    private showToast: ShowToastService,private vendorService: VendorDataService, private loadingService: LoadingService) {
      this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
    }

  gotoMenu(){
    console.log('yes');
  }

  viewMenuDetail(vendor){
    let navigationExtras: NavigationExtras = {
      queryParams: vendor
  };
    this.router.navigate(['menu'],navigationExtras);
  }

  setFilteredRestaurant(){
    this.filteredVendors = [];
    this.filteredVendors = this.vendors.filter((vendor) => {
      return vendor.vendor_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  ngOnInit() {
    this.loadingService.present();    
    this.menuCtrl.enable(true); 

    this.route.queryParams.subscribe(params => {
      this.vendorService.getVendors(params.id).subscribe((data:any) => {
        this.vendors = data.vendors;
        this.filteredVendors =data.vendors;
        this.loadingService.dismiss();        
      }, err => { this.loadingService.dismiss(); });  
    });
  }
}
