import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading/loading.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ShowToastService } from '../services/toast/show-toast.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private router: Router,private menuCtrl: MenuController,private showToast: ShowToastService,
    private authService: AuthenticationService, private loadingService: LoadingService) { }
  public user:any = {};
  
  register(user){
    this.loadingService.present();
    this.authService.register(user).subscribe((data:any) => {
      if(data.success.msg){
        this.router.navigate(['login']);
        this.showToast.toast(data.success.msg);
      }
      this.loadingService.dismiss();
    }, err => {
      this.loadingService.dismiss();      
      if(err.error.message){
        this.showToast.toast(err.error.message);
      }
      else{
        let errors = [];
        let errorArray = Object.values(err.error.error);

        errorArray.forEach(elem => { errors.push(elem[0]); });

        this.showToast.toast(errors.join());
      }
    });
    // this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

}
