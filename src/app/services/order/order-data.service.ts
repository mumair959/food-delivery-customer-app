import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { ShowToastService } from '../toast/show-toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderDataService {
  apiUrl = 'https://www.pohnchadoo.pk/api/';
  constructor(private router: Router,private storage: Storage, private platform: Platform, 
    private showToast: ShowToastService, private http: HttpClient) { }

    getAllOrders(){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));

      return this.http.get(this.apiUrl+'get_all_orders/'+auth_user.user_id,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }

    getOrderDetail(order_id){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));

      return this.http.get(this.apiUrl+'get_order/'+order_id,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }

    placeOrder(order){
      let headers = new HttpHeaders();
      let auth_user = JSON.parse(localStorage.getItem('auth_user'));
      order.user_id = auth_user.user_id;
      return this.http.post(this.apiUrl+'place_order',order,{headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json', 'Authorization' : auth_user.token_type+' '+auth_user.access_token}})
    }
}
