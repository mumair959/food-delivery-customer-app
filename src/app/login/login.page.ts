import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import  { AuthenticationService } from '../services/auth/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user:any = {};
  constructor(private router: Router,private menuCtrl: MenuController, 
    private showToast: ShowToastService,private authService: AuthenticationService) { }

  loginUser(){
    this.authService.login(this.user);
    // this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

}
