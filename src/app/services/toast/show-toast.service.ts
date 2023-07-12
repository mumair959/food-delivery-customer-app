import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ShowToastService {

  constructor(private toastCtrl: ToastController) { }

  async toast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      animated:true,      
      position: 'bottom',
    });
    toast.present();
  }
}
