import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UrlConst } from '../common/url.constants';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authenticationService: AuthService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let result = true;
    const currentUser = this.authenticationService.currentUserValue;
    if (!currentUser) {
      this.router.navigate([UrlConst.LOGIN]);
      result = false;
      return;
    }
    else {
      this.authenticationService.routerWebsite();
      localStorage.setItem("URL_STATE", state.url);
      result = true;
    }

    let urlCurent: Array<string> = state.url.split('/'); 
    let urlMini = state.url;

    if(urlCurent.length == 4) urlMini = urlCurent[2] + '/' + urlCurent[3];
    else if (urlCurent.length == 3) urlMini = urlCurent[2];

    if (['home/index', 'system/account', 'sms/campaign', 'manager/sender'].indexOf(urlMini.split('?')[0]) < 0) {
      let data: any = await this.authenticationService.getMenuAccess();
      if (data.indexOf(urlMini) == -1) {
        result = false;
      }
    }
    return result;
  }
}