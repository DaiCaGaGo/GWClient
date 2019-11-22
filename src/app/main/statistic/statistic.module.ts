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
import { defineLocale, viLocale, PaginationModule, ModalModule, TabsModule, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap';

import { StatisticComponent } from './statistic.component';
import { AccountCimastComponent } from './account-cimast/account-cimast.component';
import { SmsListAgencyComponent } from './sms-list-agency/sms-list-agency.component';
import { AccountCimastTranComponent } from './account-cimast-tran/account-cimast-tran.component';
import { SmsListComponent } from './sms-list/sms-list.component';
import { AccountFeeComponent } from './account-fee/account-fee.component';
import { CustomersComponent } from './customers/customers.component';
import { QuotaRemainComponent } from './quota-remain/quota-remain.component';
import { SmsErrorComponent } from './sms-error/sms-error.component';
import { SmsBrandnameComponent } from './sms-brandname/sms-brandname.component';
import { FindPhoneComponent } from './find-phone/find-phone.component';
import { GeneralComponent } from './general/general.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const smsRoutes: Routes = [{
  path: '', component: StatisticComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'account-cimast', component: AccountCimastComponent, data: { MENU_CODE: 'ACCOUNT_CIMAST' }, canActivate: [AuthGuard] },
    { path: 'account-cimast-tran', component: AccountCimastTranComponent, data: { MENU_CODE: 'ACCOUNT_CIMAST_TRAN' }, canActivate: [AuthGuard] },
    { path: 'sms-list', component: SmsListComponent, data: { MENU_CODE: 'SMS_LIST' }, canActivate: [AuthGuard] },
    { path: 'account-fee', component: AccountFeeComponent, data: { MENU_CODE: 'ACCOUNT_FEE' }, canActivate: [AuthGuard] },
    { path: 'customers', component: CustomersComponent, data: { MENU_CODE: 'CUSTOMER' }, canActivate: [AuthGuard] },
    { path: 'sms-list-agency', component: SmsListAgencyComponent, data: { MENU_CODE: 'SMS_LIST_AGENCY' }, canActivate: [AuthGuard] },
    { path: 'sms-error', component: SmsErrorComponent, data: { MENU_CODE: 'SMS_ERROR' }, canActivate: [AuthGuard] },
    { path: 'sms-brandname', component: SmsBrandnameComponent, data: { MENU_CODE: 'STATISTIC_BY_SENDER' }, canActivate: [AuthGuard] },
    { path: 'find-phone', component: FindPhoneComponent, data: { MENU_CODE: 'FIND_SMS_BY_PHONE' }, canActivate: [AuthGuard] },
    { path: 'general', component: GeneralComponent, data: { MENU_CODE: 'BY_GENERAL' }, canActivate: [AuthGuard] },
  ]
}];

@NgModule({
  declarations: [
    StatisticComponent,
    SmsListAgencyComponent,
    AccountCimastComponent,
    AccountCimastTranComponent,
    SmsListComponent,
    AccountFeeComponent,
    CustomersComponent,
    QuotaRemainComponent,
    SmsErrorComponent,
    SmsBrandnameComponent,
    FindPhoneComponent,
    GeneralComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AngularMultiSelectModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forChild(smsRoutes),
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

export class StatisticModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
