import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ShowToastService } from '../toast/show-toast.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private geolocation: Geolocation,private showToast: ShowToastService) { }

  initializeLocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      localStorage.setItem('current_location',JSON.stringify({latitude: resp.coords.latitude, longitude: resp.coords.longitude}));
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

}
