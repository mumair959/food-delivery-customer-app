import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

import  { AuthenticationService } from './services/auth/authentication.service';
import { CartService } from './services/cart/cart.service';
import { LocationService } from './services/location/location.service';
import { AddressDataService } from './services/address/address-data.service';
import { ShowToastService } from './services/toast/show-toast.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public loggedInUser:string = 'Hello!';
  public appPages = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'apps'
    },
    {
      title: 'My Wallet',
      url: '/wallet',
      icon: 'cash'
    },
    {
      title: 'My Orders',
      url: '/orders',
      icon: 'clipboard'
    },
    {
      title: 'My Profile',
      url: '/profile',
      icon: 'person'
    },
    {
      title: 'My Address',
      url: '/address',
      icon: 'pin'
    },
    {
      title: 'Share And Earn',
      url: '/refer',
      icon: 'cash'
    },
    // {
    //   title: 'Contact Us',
    //   url: '/contact',
    //   icon: 'chatbubbles'
    // },
    // {
    //   title: 'Invite Friends',
    //   url: '/invite',
    //   icon: 'share'
    // },
    // {
    //   title: 'Setting',
    //   url: '/setting',
    //   icon: 'cog'
    // },
    // {
    //   title: 'FAQ',
    //   url: '/faq',
    //   icon: 'call'
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private fcm: FCM,
    private socialSharing: SocialSharing,
    public menuCtrl: MenuController,
    private authService: AuthenticationService,
    private cartService: CartService,
    private locationService: LocationService,
    private addressService: AddressDataService,
    private toastService: ShowToastService
  ) {
    this.initializeApp();
  }

  logoutApp(){
    this.menuCtrl.close();
    this.authService.logout();
  }

  shareApp(){
    this.socialSharing.shareViaWhatsApp("PohnchaDoo App Download Link: ",null,'https://play.google.com/store/apps/details?id=pk.pohnchado')
    .then((success) =>{
        console.log("Success");
     })
      .catch(()=>{
        console.log("Could not share information");
      });
  }

  initializeApp() {
    this.cartService.initializeCart(); //Initialize cart on app start
    this.locationService.initializeLocation(); //Initialize location on app start

    // Get user info and address on app load
    if(localStorage.getItem('auth_user')){
      this.loggedInUser = JSON.parse(localStorage.getItem('auth_user')).user_name;
      this.authService.getUserInfo();   
      
      this.addressService.getAllAddresses().subscribe((data:any) => {
        if(!data.msg){
          localStorage.setItem('user_address',JSON.stringify(data.address));
        }
      }, err => { });
    }

    this.authService.authState.subscribe(state => {
      if (state) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['login']);
      }
    });

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcm.getToken().then(token => {
        if(localStorage.getItem('auth_user')){
          this.authService.sendFCMTokenToServer(token);
        }
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        if(localStorage.getItem('auth_user')){
          this.authService.sendFCMTokenToServer(token);
        }
      });


      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
          this.router.navigate([data.landing_page]);
        } else {
          console.log('Received in foreground');
          this.router.navigate([data.landing_page]);
        }
      });
    });
  }
}
