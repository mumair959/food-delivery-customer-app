import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ShowToastService } from '../toast/show-toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from '../loading/loading.service';
import { AddressDataService } from '../../services/address/address-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState = new BehaviorSubject(false);
  verifyState = new BehaviorSubject(false);
  apiUrl = 'https://www.pohnchadoo.pk/api/';

  constructor(private router: Router,private storage: Storage, private platform: Platform, private  alertCtrl: AlertController, private addressService:AddressDataService,
    private showToast: ShowToastService, private http2: HTTP, private http: HttpClient, private loadingService: LoadingService) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
      this.isVerified();
    });
   }

   ifLoggedIn() {
    let response = localStorage.getItem('auth_user');
    if (response) {
      this.authState.next(true);
    }
  }

  isVerified() {
    let response = JSON.parse(localStorage.getItem('auth_user'));
    if(response){
      if (response.user_verified == '1') {
        this.verifyState.next(true);
      } else {
        this.verifyState.next(false);
      }
    }
  }

  verifyAccount(verify){
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    verify.user_id = auth_user.user_id;
    return this.http.post(this.apiUrl+'verify_account',verify,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}});
  }

  resendVerificationCode(){
    let user:any = {};
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    user.user_id = auth_user.user_id;
    return this.http.post(this.apiUrl+'resend_verification_code',user,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}});
  }

  getUserInfo(){
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    
    this.http.get(this.apiUrl+'get_user_info/'+auth_user.user_id,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}}).subscribe((data:any) => {
      if (data.user_info){
        localStorage.setItem('user_info',JSON.stringify(data.user_info));
      }     
    }, err => { });
  }

  getUserAddress(){
    this.addressService.getAllAddresses().subscribe((data:any) => {
      if(!data.msg){
        localStorage.setItem('user_address',JSON.stringify(data.address));
      }
    }, err => { });
  }

  updateUserInfo(userInfo){
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    
    return this.http.post(this.apiUrl+'edit_user_info',userInfo,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}});
  }
 
 
  login(user) {

    this.loadingService.present();
    let headers = new HttpHeaders();
    this.http.post(this.apiUrl+'login',user,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'}}).subscribe(data => {
      localStorage.setItem('auth_user', JSON.stringify(data));
      this.getUserInfo();
      this.getUserAddress();
      this.authState.next(true);
      this.loadingService.dismiss();

      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 700);
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
  }

  register(user){
    let headers = new HttpHeaders();
    return this.http.post(this.apiUrl+'register',user,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'}});
  }

  forgotPassword(user){
    let headers = new HttpHeaders();
    return this.http.post(this.apiUrl+'forgot_password',user,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'}});
  }

  resetPassword(user){
    let headers = new HttpHeaders();
    return this.http.post(this.apiUrl+'reset_password',user,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'}});
  }
 
  logout() {
    this.loadingService.present();
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    
    this.http.post(this.apiUrl+'logout',{user_id : auth_user.user_id},{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}}).subscribe((data:any) => {
      this.loadingService.dismiss();
      if (data.success){
        this.showToast.toast(data.success);
        localStorage.removeItem('auth_user');
        this.router.navigate(['login']);
        this.authState.next(false);
      }
      
    }, err => {
      this.loadingService.dismiss();
      this.showToast.toast('Unauthorized');
    });
  }

  sendFCMTokenToServer(token) {
    let auth_user = JSON.parse(localStorage.getItem('auth_user'));
    
    this.http.post(this.apiUrl+'send_fcm_token',{user_id : auth_user.user_id,fcm_token : token},{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}}).subscribe((data:any) => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }
 
  isAuthenticated() {
    return this.authState.value;
  }
}
