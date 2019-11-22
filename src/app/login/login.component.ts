import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlConst } from '../core/common/url.constants';
import { AuthService } from '../core/services/auth.service';
import { UtilityService } from '../core/services/utility.service';
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public messageLogin: string;
  public returnUrl: string;
  public submitted = false;
  public loading = false;
  public user: SocialUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private utilityService: UtilityService) {
    if (authService.currentUser) {
      this.router.navigate([UrlConst.HOME]);
    }
  }

  ngOnInit() {
    this.submitted = false;
    this.loginForm = new FormGroup({
      username: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])),
      password: new FormControl("", Validators.compose([
        Validators.required,
        this.pwdLengthValidator
      ]))
    });
  }

  pwdLengthValidator(control) {
    if (control.value.length < 6) {
      return { password: true };
    }
  }

  get form() {
    return this.loginForm.controls;
  }

  public async loginSystem() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.loading = true;
      let response: any = await this.authService.loginSystem(this.form.username.value, this.form.password.value, '');
      if (response) {
        this.loading = false;
        if (response.err_code != 0) {
          if (response.err_code != -1 && response.err_code != -2) {
            this.messageLogin = response.err_message;
          }
          else {
            this.messageLogin = this.utilityService.translate('login.msg_not_connect_service');
          }
        }
      }
      else {
        this.messageLogin = this.utilityService.translate('login.msg_not_connect_service');
        this.loading = false;
      }
    }
  }

  public loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  public loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  public changeLanguage(lang) {
    this.utilityService.changeLanguageCurrent(lang);
  }
}
