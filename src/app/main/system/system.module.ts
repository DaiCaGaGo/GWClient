import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AppConst } from 'src/app/core/common/app.constants';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DxTreeListModule } from 'devextreme-angular';
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap';

import { SystemComponent } from './system.component';
import { MenuComponent } from './menu/menu.component';
import { SysvarComponent } from './sysvar/sysvar.component';
import { TestComponent } from './test/test.component';
import { AccountVendorComponent } from './account-vendor/account-vendor.component';
import { RoleComponent } from './role/role.component';
import { RoleMenuComponent } from './role-menu/role-menu.component';
import { AccountComponent } from './account/account.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { PartnerComponent } from './partner/partner.component';
import { PartnererrcodeComponent } from './partnererrcode/partnererrcode.component';
import { PartnerProductComponent } from './partner-product/partner-product.component';
import { TelcoComponent } from './telco/telco.component';
import { AccountQuotaComponent } from './account-quota/account-quota.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const systemRoutes: Routes = [{
  path: '', component: SystemComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'sysvar', component: SysvarComponent, data: { MENU_CODE: 'SYSTEM_CONFIG' }, canActivate: [AuthGuard] },
    { path: 'menu', component: MenuComponent, data: { MENU_CODE: 'MENU' }, canActivate: [AuthGuard] },
    { path: 'test', component: TestComponent, data: { MENU_CODE: 'TEST' }, canActivate: [AuthGuard] },
    { path: 'account-vendor', component: AccountVendorComponent, data: { MENU_CODE: 'ACCOUNT_VENDOR' }, canActivate: [AuthGuard] },
    { path: 'role', component: RoleComponent, data: { MENU_CODE: 'ROLE_GROUP' }, canActivate: [AuthGuard] },
    { path: 'role-menu', component: RoleMenuComponent, data: { MENU_CODE: 'ROLE_GROUP_MENU' }, canActivate: [AuthGuard] },
    { path: 'account', component: AccountComponent, data: { MENU_CODE: 'ACCOUNT_LIST' }, canActivate: [AuthGuard] },
    { path: 'account-menu', component: AccountMenuComponent, data: { MENU_CODE: 'ACCOUNT_MENU' }, canActivate: [AuthGuard] },
    { path: 'partner', component: PartnerComponent, data: { MENU_CODE: 'PARTNER' }, canActivate: [AuthGuard] },
    { path: 'partner-error-code', component: PartnererrcodeComponent, data: { MENU_CODE: 'PARTNER_ERROR_CODE' }, canActivate: [AuthGuard] },
    { path: 'partner-product', component: PartnerProductComponent, data: { MENU_CODE: 'PARTNER_PRODUCT' }, canActivate: [AuthGuard] },
    { path: 'telco', component: TelcoComponent, data: { MENU_CODE: 'TELCO' }, canActivate: [AuthGuard] },
    { path: 'account-quota', component: AccountQuotaComponent, data: { MENU_CODE: 'ACCOUNT_QUOTA' }, canActivate: [AuthGuard] },
  ]
}];

@NgModule({
  declarations: [
    SystemComponent,
    MenuComponent,
    SysvarComponent,
    TestComponent,
    AccountVendorComponent,
    RoleComponent,
    RoleMenuComponent,
    AccountComponent,
    AccountMenuComponent,
    PartnerComponent,
    PartnererrcodeComponent,
    PartnerProductComponent,
    TelcoComponent,
    AccountQuotaComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DxTreeListModule,
    AngularMultiSelectModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(systemRoutes),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: function (http: HttpClient) {
          return new TranslateHttpLoader(http)
        },
        deps: [HttpClient]
      }
    })
  ]
})

export class SystemModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
