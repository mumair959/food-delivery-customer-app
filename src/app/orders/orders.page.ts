import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import { OrderDataService } from '../services/order/order-data.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  public orders:any = [];
  public cartCount:any;
  public backButtonSubscription;
  constructor(private router: Router,private menuCtrl: MenuController, private loadingService: LoadingService, 
    private showToast: ShowToastService,private orderService: OrderDataService,private platform: Platform) {
      this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
     }

  viewDetail(order){
    let navigationExtras: NavigationExtras = {
      queryParams: {order_id: order.id}
    };
    this.router.navigate(['order-detail'],navigationExtras);
  }

  ngOnInit() {
    this.loadingService.present();
    this.menuCtrl.enable(true);
    this.orderService.getAllOrders().subscribe((data:any) => {
      if(!data.msg){
        this.orders = data.orders;        
      }
      this.loadingService.dismiss();
    }, err => { this.loadingService.dismiss(); });
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
