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

import { ManagerComponent } from './manager.component';
import { SenderGroupComponent } from './sender-group/sender-group.component';
import { SenderComponent } from './sender/sender.component';

import { ProductComponent } from './product/product.component';
import { AccountProductComponent } from './account-product/account-product.component';
import { BirthdayProductComponent } from './birthday-product/birthday-product.component';
import { MappingComponent } from './mapping/mapping.component';

defineLocale(AppConst.LANGUAGE_VI, viLocale);

export const managerRoutes: Routes = [{
  path: '', component: ManagerComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'sender-group', component: SenderGroupComponent, data: { MENU_CODE: 'SENDER_GROUP' }, canActivate: [AuthGuard] },
    { path: 'sender', component: SenderComponent, data: { MENU_CODE: 'SENDER' }, canActivate: [AuthGuard] },
    { path: 'product', component: ProductComponent, data: { MENU_CODE: 'PRODUCT' }, canActivate: [AuthGuard] },
    { path: 'account-product', component: AccountProductComponent, data: { MENU_CODE: 'ACCOUNT_PRODUCT' }, canActivate: [AuthGuard] },
    { path: 'mapping', component: MappingComponent, data: { MENU_CODE: 'MAPPING' }, canActivate: [AuthGuard] }
  ]
}];

@NgModule({
  declarations: [
    ManagerComponent,
    SenderGroupComponent,
    SenderComponent,
    AccountProductComponent,
    ProductComponent,
    BirthdayProductComponent,
    MappingComponent
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
    RouterModule.forChild(managerRoutes),
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

export class ManagerModule {
  constructor(private bsLocaleService: BsLocaleService, private trans: TranslateService) {
    this.bsLocaleService.use(this.trans.defaultLang);
  }
}
