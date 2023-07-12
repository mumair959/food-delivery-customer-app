import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [AuthGuardService]
  },
  { path: 'orders', loadChildren: './orders/orders.module#OrdersPageModule',canActivate: [AuthGuardService] },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule',canActivate: [AuthGuardService] },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule',canActivate: [AuthGuardService] },
  { path: 'invite', loadChildren: './invite/invite.module#InvitePageModule',canActivate: [AuthGuardService] },
  { path: 'setting', loadChildren: './setting/setting.module#SettingPageModule',canActivate: [AuthGuardService] },
  { path: 'faq', loadChildren: './faq/faq.module#FaqPageModule',canActivate: [AuthGuardService] },
  { path: 'terms', loadChildren: './terms/terms.module#TermsPageModule',canActivate: [AuthGuardService] },
  { path: 'address', loadChildren: './address/address.module#AddressPageModule',canActivate: [AuthGuardService] },
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule',canActivate: [AuthGuardService] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule',canActivate: [AuthGuardService] },
  { path: 'customize', loadChildren: './customize/customize.module#CustomizePageModule',canActivate: [AuthGuardService] },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule',canActivate: [AuthGuardService] },
  { path: 'order-detail', loadChildren: './order-detail/order-detail.module#OrderDetailPageModule',canActivate: [AuthGuardService] },
  { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'reset-password', loadChildren: './reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
  { path: 'refer', loadChildren: './refer/refer.module#ReferPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
