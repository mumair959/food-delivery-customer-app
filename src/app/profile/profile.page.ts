import { Component, OnInit } from '@angular/core';
import { Platform, MenuController,AlertController } from '@ionic/angular';
import { ShowToastService } from '../services/toast/show-toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading/loading.service';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public cartCount: any;
  public userInfo:any = {};
  public backButtonSubscription;

  constructor(private router: Router, private menuCtrl: MenuController, private toastService: ShowToastService,private platform: Platform,
    private loadingService: LoadingService, private alertCtrl: AlertController, private authService: AuthenticationService) { 
    this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
  }

  async editProfile(info){
    const alert = await this.alertCtrl.create({
      header: 'Edit Profile',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: info.first_name,
          placeholder: 'Enter First Name'
        },
        {
          name: 'last_name',
          type: 'text',
          value: info.last_name,
          placeholder: 'Enter Last Name'
        },
        {
          name: 'email',
          type: 'email',
          value: info.email,
          disabled: true,
          placeholder: 'Enter Email'
        },
        {
          name: 'phone_num',
          type: 'text',
          value: info.customer.phone_num,
          placeholder: 'Enter Phone Number'
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
            data.user_id = info.id;
            
            this.loadingService.present(); 
            this.authService.updateUserInfo(data).subscribe((data:any) => {
              if(data.success){
                this.toastService.toast(data.success);
                this.router.navigate(['dashboard']);
                this.loadingService.dismiss();
              }
            }, err => { this.loadingService.dismiss(); });
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.menuCtrl.enable(true);

    this.userInfo = JSON.parse(localStorage.getItem('user_info'));
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
