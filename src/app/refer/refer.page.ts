import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {
  public cartCount: any;
  public userReferCode: any;
  constructor(private socialSharing: SocialSharing) {
    this.cartCount = JSON.parse(localStorage.getItem('cart')).itemsCount;
    this.userReferCode = JSON.parse(localStorage.getItem('auth_user')).user_referal_code;
    
   }

   shareApp(){
    this.socialSharing.shareViaWhatsApp("Download PohnchaDoo using referal code "+this.userReferCode+" to get instant Rs. 50 deposit to your wallet",null,'https://play.google.com/store/apps/details?id=pk.pohnchado')
    .then((success) =>{
        console.log("Success");
     })
      .catch(()=>{
        console.log("Could not share information");
      });
  }

  ngOnInit() {
  }

}
