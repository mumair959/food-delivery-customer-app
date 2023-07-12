import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { ShowToastService } from '../toast/show-toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  apiUrl = 'https://www.pohnchadoo.pk/api/';
  constructor(private router: Router,private storage: Storage, private platform: Platform, 
    private showToast: ShowToastService, private http: HttpClient) { }

    applyPromoCode(code){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));
      code.user_id = auth_user.user_id;
      return this.http.post(this.apiUrl+'apply_voucher_code',code,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }
}
