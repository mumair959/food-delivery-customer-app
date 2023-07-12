import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { ShowToastService } from '../toast/show-toast.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VendorDataService {
  apiUrl = 'https://www.pohnchadoo.pk/api/';
  constructor(private router: Router,private storage: Storage, private platform: Platform, 
    private showToast: ShowToastService, private http: HttpClient) { }

    getVendors(id){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));
      let currentLocatoin = JSON.parse(localStorage.getItem('current_location'));

      let params = new HttpParams();

      params = params.append('latitude', currentLocatoin.latitude);
      params = params.append('longitude', currentLocatoin.longitude);
      params = params.append('id', id);

      return this.http.get(this.apiUrl+'get_all_vendors',{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}, params : params})
    }

    getVendorMenu(id){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));

      return this.http.get(this.apiUrl+'get_vendor_menu/'+id,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }

    getMenu(vendor_id,category_id){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));

      return this.http.get(this.apiUrl+'get_menu/'+vendor_id+'/'+category_id,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }
}
