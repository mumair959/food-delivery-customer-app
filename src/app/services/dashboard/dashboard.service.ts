import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { ShowToastService } from '../toast/show-toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = 'https://www.pohnchadoo.pk/api/';
  
  constructor(private router: Router,private storage: Storage, private platform: Platform, 
    private showToast: ShowToastService, private http: HttpClient) { }

    getVendorCategories(){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));

      return this.http.get(this.apiUrl+'get_vendor_categories',{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }

    test(){
      console.log('2342342');
    }

}
