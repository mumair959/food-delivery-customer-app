import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { ShowToastService } from '../services/toast/show-toast.service';
import { OrderDataService } from '../services/order/order-data.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  public cartCount:any;
  public orderDetail:any = {};
  constructor(public router: Router,private menuCtrl: MenuController, private loadingService: LoadingService, 
    private showToast: ShowToastService,private orderService: OrderDataService,private route: ActivatedRoute) {
    this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
   }

  goBack(){
    this.router.navigate(['dashboard']);
  }

  ngOnInit() {
    this.loadingService.present();
    this.menuCtrl.enable(true);
    this.route.queryParams.subscribe(params => {
      this.orderService.getOrderDetail(params.order_id).subscribe((data:any) => {
        console.log(data);
        this.orderDetail = data.order;
        this.loadingService.dismiss();
      }, err => { this.loadingService.dismiss(); });
    });
  }

}
