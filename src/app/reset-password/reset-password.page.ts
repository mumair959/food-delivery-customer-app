import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import  { AuthenticationService } from '../services/auth/authentication.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public user:any = {};
  constructor(private router: Router,private menuCtrl: MenuController, private alertCtrl: AlertController,
    private showToast: ShowToastService,private authService: AuthenticationService, private loadingService: LoadingService) { 
      this.verifyCodeAlert();
    }

  resetPassword(user){
    let userId = JSON.parse(localStorage.getItem('verify_user_id'));
    user.user_id = userId;
    this.loadingService.present(); 
    this.authService.resetPassword(user).subscribe((data:any) => {
      if (data.error) {
        this.showToast.toast(data.error);
      }
      else if(data.success){
        this.showToast.toast(data.success);
        localStorage.removeItem('verify_user_id');
        setTimeout(() => {
          this.router.navigateByUrl('/login');          
        }, 500);
      }

      this.loadingService.dismiss();
      
    }, err => { 

      console.log(err);
      if (err.error.error_msg) {
        this.showToast.toast(err.error.error_msg);
      } else {
        let errors = [];
        let errorArray = Object.values(err.error.error);
        errorArray.forEach(elem => { errors.push(elem[0]); });
        this.showToast.toast(errors.join());
        this.loadingService.dismiss(); 
      }
    });
  }

  async verifyCodeAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Verification Code',
      message: 'Verification code has been sent to your email, please check your email',
      buttons: ['OK'],
    });
  
    await alert.present();
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

}
