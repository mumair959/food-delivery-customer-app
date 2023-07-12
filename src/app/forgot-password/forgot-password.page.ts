import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import  { AuthenticationService } from '../services/auth/authentication.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public user:any = {};
  constructor(private router: Router,private menuCtrl: MenuController, private loadingService: LoadingService, 
    private showToast: ShowToastService,private authService: AuthenticationService) { }


  sendVerificationLink(user){
    this.loadingService.present(); 
    this.authService.forgotPassword(user).subscribe((data:any) => {
      if (data.error) {
        this.showToast.toast(data.error);
      }
      else if(data.success){
        this.showToast.toast(data.success);
        localStorage.setItem('verify_user_id',data.verify_user_id);
        setTimeout(()=>{
          this.router.navigateByUrl('/reset-password');
        },500);
      }

      this.loadingService.dismiss();
      
    }, err => { this.loadingService.dismiss(); });
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

}
