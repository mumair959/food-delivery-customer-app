import { Component, OnInit } from '@angular/core';
import { MenuController,AlertController } from '@ionic/angular';
import { Router,NavigationExtras  } from '@angular/router';
import { Platform } from '@ionic/angular';

import { ShowToastService } from '../services/toast/show-toast.service';
import  { DashboardService } from '../services/dashboard/dashboard.service';
import { LoadingService } from '../services/loading/loading.service';
import { LocationService } from '../services/location/location.service';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public categories:any = [];
  public cartCount:any = 0;
  public serviceNotFound:boolean = false;
  public categoryWithVendor:any = [3,7];
  public slideImages:any = [
    'assets/sliders/1.jpeg',
    'assets/sliders/2.jpeg',
    'assets/sliders/3.jpeg',
    'assets/sliders/4.jpeg'
    
  ];
  backButtonSubscription; 

  constructor(private router: Router,private menuCtrl: MenuController, private loadingService: LoadingService,private alertCtrl: AlertController,private locationService: LocationService, 
    private showToast: ShowToastService,private dashboardService: DashboardService,private platform: Platform, private authService: AuthenticationService) {
      if(localStorage.getItem('cart')){
        this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;        
      }
      // Check account verification
      // this.checkAccountVerify();
     }

  viewVendors(category){
    
    this.locationService.initializeLocation(); //Get new location

    setTimeout(() => {
      // If exist then proceed
      if(this.categoryWithVendor.includes(category.id)){
        let navigationExtras: NavigationExtras = {
          queryParams: category
        };
        this.router.navigate(['home'],navigationExtras);
      }
      else{
        category.venderType = 'without vendor';
        let navigationExtras: NavigationExtras = {
          queryParams: category
      };
        this.router.navigate(['menu'],navigationExtras);
      }
    }, 800);
    
    
  }

  async locationPopUp(){
    const alert = await this.alertCtrl.create({
      header: 'Alert!',
      subHeader: 'Please turn on your device location first',
      buttons: [],
      backdropDismiss: false,
    });

    await alert.present();
  }

  checkAccountVerify(){
    this.authService.verifyState.subscribe(state => {
      if (!state) {
        this.showVerifyPopup();
      }
    });
  }

  async showVerifyPopup(){
    const alert = await this.alertCtrl.create({
      header: 'Verify Your Account',
      subHeader: 'Please check your email for verification code',
      backdropDismiss: false,
      inputs: [
        {
          name: 'verification_code',
          type: 'text',
          placeholder: 'Enter Verification Code'
        },  
      ],
      buttons: [
        {
          text: 'Resend Code',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('resend');
            this.loadingService.present();

              this.authService.resendVerificationCode().subscribe((data:any) => {
                if (data.success) {
                  this.showToast.toast(data.success);
                }                 
                this.loadingService.dismiss();
              }, err => {
                this.loadingService.dismiss();
              });

            this.showVerifyPopup();
          }
        }, {
          text: 'Activate',
          handler: (verify) => {
            this.loadingService.present();
            if(verify.verification_code == ""){
              this.showToast.toast("Please enter verification code");
              this.loadingService.dismiss();
              this.showVerifyPopup();
            }
            else{
              this.authService.verifyAccount(verify).subscribe((data:any) => {
                if (data.success) {
                  let auth_user = JSON.parse(localStorage.getItem('auth_user'));
                  auth_user.user_verified = '1';
                  localStorage.setItem('auth_user',JSON.stringify(auth_user));
                  this.authService.verifyState.next(true);
                  this.showToast.toast(data.success);
                }                 
                this.loadingService.dismiss();
              }, err => { 
                this.showToast.toast(err.error.error); 
                this.showVerifyPopup();
                this.loadingService.dismiss();
              });
            }
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadingService.present();
    this.menuCtrl.enable(true);

    // First check location exist
    if (!localStorage.getItem('current_location')) {
      this.locationPopUp();
      this.loadingService.dismiss();
      return;
    }

    this.dashboardService.getVendorCategories().subscribe((data:any) => {
      if (data.categories.length <= 0) {
        this.serviceNotFound = true;
      }
      this.categories = data.categories;
      this.loadingService.dismiss();
    }, err => { this.loadingService.dismiss(); });
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {   
      navigator['app'].exitApp();
    });
   }

   ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
   }

}
