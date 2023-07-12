import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import { WalletService } from '../services/wallet/wallet.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public cartCount: any;
  public walletAmount: any;
  public authUser: any;
  public backButtonSubscription;
  constructor(private router: Router,
              private menuCtrl: MenuController, 
              private loadingService: LoadingService, 
              private showToast: ShowToastService,
              private walletService: WalletService,
              private platform: Platform) {
    this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
   }

  ngOnInit() {
    this.loadingService.present();
    this.menuCtrl.enable(true);
    this.walletService.getWalletAmount().subscribe((data:any) => {
      this.walletAmount = data.wallet_amount;
      let authUser = JSON.parse(localStorage.getItem('auth_user'));
      authUser.user_wallet = data.wallet_amount;
      localStorage.setItem('auth_user',JSON.stringify(authUser));
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
