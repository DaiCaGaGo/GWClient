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

import { SmsComponent } from './sms.component';
import { CampaignComponent } from './campaign/campaign.component';
import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { PhoneBlacklistComponent } from './phone-blacklist/phone-blacklist.component';
import { SmsCustomizeComponent } from './sms-customize/sms-customize.component';
import { CustomerSmsComponent } from './customer-sms/customer-sms.component';
import { SendSMSComponent } from './send-sms/send-sms.component';
import { SmsBirthdayComponent } from './sms-birthday/sms-birthday.component';
import { BirthdayGroupComponent } from './birthday-group/birthday-group.component';
import { GroupCustomerComponent } from './group-customer/group-customer.component';
import { SmsBirthdayIndayComponent } from './sms-birthday-inday/sms-birthday-inday.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const smsRoutes: Routes = [{
  path: '', component: SmsComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'campaign', component: CampaignComponent, data: { MENU_CODE: 'CAMPAIGN_MANAGER' }, canActivate: [AuthGuard] },
    { path: 'sms-customize', component: SmsCustomizeComponent, data: { MENU_CODE: 'SEND_SMS_CUSTOMIZE' }, canActivate: [AuthGuard] },
    { path: 'phone-blacklist', component: PhoneBlacklistComponent, data: { MENU_CODE: 'PHONE_BLACKLIST' }, canActivate: [AuthGuard] },
    { path: 'customer-sms', component: CustomerSmsComponent, data: { MENU_CODE: 'SEND_SMS_CUSTOMER' }, canActivate: [AuthGuard] },
    { path: 'send-sms', component: SendSMSComponent, data: { MENU_CODE: 'SEND_SMS_PHONELIST' }, canActivate: [AuthGuard] },
    { path: 'sms-template', component: SmsTemplateComponent, data: { MENU_CODE: 'SMS_TEMPLATE' }, canActivate: [AuthGuard] },
    { path: 'sms-birthday', component: SmsBirthdayComponent, data: { MENU_CODE: 'SEND_SMS_BIRTHDAY' }, canActivate: [AuthGuard] },
    { path: 'birthday-group', component: BirthdayGroupComponent, data: { MENU_CODE: 'BIRTHDAY_GROUP' }, canActivate: [AuthGuard] },
    { path: 'group-customer', component: GroupCustomerComponent, data: { MENU_CODE: 'GROUP_CUSTOMER' }, canActivate: [AuthGuard] },
    { path: 'sms-birthday-inday', component: SmsBirthdayIndayComponent, data: { MENU_CODE: 'SMS_BIRTHDAY_INDAY' }, canActivate: [AuthGuard] }  
  ]
}];

@NgModule({
  declarations: [
    SmsComponent,
    CampaignComponent,
    SmsTemplateComponent,
    PhoneBlacklistComponent,
    SmsCustomizeComponent,
    CustomerSmsComponent,
    SendSMSComponent,
    SmsBirthdayComponent,
    BirthdayGroupComponent,
    GroupCustomerComponent,
    SmsBirthdayIndayComponent
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

export class SmsModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
