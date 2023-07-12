import { Component, OnInit } from '@angular/core';
import { Platform,MenuController,AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShowToastService } from '../services/toast/show-toast.service';
import { AddressDataService } from '../services/address/address-data.service';
import { LoadingService } from '../services/loading/loading.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  public address:any = [];
  public cartCount:any;
  public backButtonSubscription;
  constructor(private router: Router,private menuCtrl: MenuController, private alertCtrl: AlertController,private platform: Platform,
    private showToast: ShowToastService,private addressService: AddressDataService, private loadingService: LoadingService) {
      this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
     }

  async addAddress(){
    const alert = await this.alertCtrl.create({
      header: 'Add New Address',
      inputs: [
        {
          name: 'house_num',
          type: 'text',
          placeholder: 'Enter House Address'
        },
        {
          name: 'street',
          type: 'text',
          placeholder: 'Enter Street Name'
        },
        {
          name: 'area',
          type: 'text',
          placeholder: 'Enter Area Name'
        },
        {
          name: 'nearest_place',
          type: 'text',
          placeholder: 'Enter Nearest Place'
        },
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            this.loadingService.present(); 
            this.addressService.addAddress(data).subscribe((data:any) => {
              if(data.msg){

                // If address added get from db
                this.addressService.getAllAddresses().subscribe((data:any) => {
                  if(!data.msg){
                    localStorage.setItem('user_address',JSON.stringify(data.address));
                  }
                this.router.navigate(['dashboard']);                
                }, err => { this.router.navigate(['dashboard']); });

                this.showToast.toast(data.msg);
                this.loadingService.dismiss();
              }
            }, err => { 
              let errors = [];
              let errorArray = Object.values(err.error.error);
      
              errorArray.forEach(elem => { errors.push(elem[0]); });
      
              this.showToast.toast(errors.join());
              this.loadingService.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAddress(address){
    let add:any = {};
    add.id = parseInt(address.address_id);
    this.loadingService.present();
    this.addressService.deleteAddress(add).subscribe((data:any) => {
      if(data.msg){
        localStorage.removeItem('user_address');               
        this.showToast.toast(data.msg);
        this.router.navigate(['dashboard']);
        this.loadingService.dismiss();
      }
      this.loadingService.dismiss();
    }, err => { this.loadingService.dismiss(); });
  }

  async editAddress(address){
    const alert = await this.alertCtrl.create({
      header: 'Edit Address',
      inputs: [
        {
          name: 'house_num',
          type: 'text',
          value: address.house_num,
          placeholder: 'Enter House Address'
        },
        {
          name: 'street',
          type: 'text',
          value: address.street,
          placeholder: 'Enter Street Name'
        },
        {
          name: 'area',
          type: 'text',
          value: address.area,
          placeholder: 'Enter Area Name'
        },
        {
          name: 'nearest_place',
          type: 'text',
          value: address.nearest_place,
          placeholder: 'Enter Nearest Place'
        },
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            data.id = parseInt(address.address_id);
            this.loadingService.present(); 
            this.addressService.editAddress(data).subscribe((data:any) => {
              if(data.msg){
                this.showToast.toast(data.msg);
                this.router.navigate(['dashboard']);
                this.loadingService.dismiss();
              }
            }, err => { 
              let errors = [];
              let errorArray = Object.values(err.error.error);
      
              errorArray.forEach(elem => { errors.push(elem[0]); });
      
              this.showToast.toast(errors.join());
              this.loadingService.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.loadingService.present();  
    this.menuCtrl.enable(true);
    this.addressService.getAllAddresses().subscribe((data:any) => {
      if(!data.msg){
        this.address = data.address;        
      }
      this.loadingService.dismiss();
    }, err => { this.loadingService.dismiss(); });
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {   
      this.router.navigate(['dashboard']);
    });
   }

   ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
   }

}
