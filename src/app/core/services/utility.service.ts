import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AppConst } from '../common/app.constants';
import { setTheme } from 'ngx-bootstrap/utils';
import { HttpClient } from '@angular/common/http';
import { ErrorCode } from '../models/error-code';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})

export class UtilityService {
  constructor(private trans: TranslateService, private http: HttpClient) { }

  public changeLanguageCurrent(language: string) {
    if (language != localStorage.getItem(AppConst.CURRENT_LANG)) {
      this.trans.use(language);
      localStorage.setItem(AppConst.CURRENT_LANG, language);
      this.setErrorCodeByLanguage(language);
      location.reload();
    }
  }

  public setLanguageCurrent() {
    let currentLang = localStorage.getItem(AppConst.CURRENT_LANG);
    if (!currentLang) {
      this.trans.setDefaultLang(AppConst.LANGUAGE_VI);
      this.trans.use(AppConst.LANGUAGE_VI);
      localStorage.setItem(AppConst.CURRENT_LANG, AppConst.LANGUAGE_VI);
    } else if (!this.trans.currentLang) {
      this.trans.use(currentLang);
    }
  }

  public async setErrorCodeByLanguage(language: string) {
    let response: any = await this.http.get(AppConst.BASE_API + "/api/errorcode/GetErrorCodeByLanguageAsync?language=" + language).toPromise();
    if (response) {
      localStorage.setItem(AppConst.ERROR_CODE, JSON.stringify(response.data));
    }
  }

  public async getRole(menuCode: string) {
    let response: any = await this.http.get(AppConst.BASE_API + "/api/AccessRole/GetRoleByMenuCode?menuCode=" + menuCode).toPromise();
    if(response && response.data) {
      return <Role>response.data;
    }
  }

  public getErrorMessage(errCode: string) {
    let message = "";
    let errorCode: ErrorCode = JSON.parse(localStorage.getItem(AppConst.ERROR_CODE));
    for (let index in errorCode) {
      let item: any = errorCode[index];
      if (item.ERR_NUM == errCode) {
        message = errorCode[index].MESSAGE;
      }
    }
    if (message == "") {
      message = this.translate("global.err_code_not_define");
    }
    return message;
  }

  public setBootstrapTheme() {
    setTheme("bs3");
  }

  public formatNumberTotalPage(input: number): number {
    return Math.ceil(input);
  }

  public translate(key: string): string {
    return this.trans.instant(key);
  }

  public formatDateTempalte(input: any): Date {
    return new Date(input.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
  }

  public formatDateToString(input: any, template: string): string {
    if (typeof input == "object") {
      return formatDate(input, template, 'en-US');
    }
    else if (typeof input == "string") {
      return formatDate(this.formatDateTempalte(input), template, 'en-US');
    }
    else {
      return "";
    }
  }

  public getTelco(phone): string {

    phone = this.addHeadPhone84(phone);

    let result = "";

    let listViettel = ["086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039",
      "0162", "0163", "0164", "0165", "0166", "0167", "0168", "0169", "030"];
    let listMobi = ["089", "090", "093", "070", "079", "077", "076", "078",
      "0120", "0121", "0122", "0126", "0128"];
    let listVina = ["088", "091", "094", "083", "084", "085", "081", "082",
      "0123", "0124", "0125", "0127", "0129"];
    let listVnMobile = ["092", "052", "056", "058"];
    let listGMobile = ["099", "059", "0199"];
    let listSFone = ["095"];
    let listDDMobile = ["087"];

    if (phone != null && phone != "" && phone != undefined) {

      if (phone.indexOf("84") == 0) {
        if (phone.length == 11) phone = "0" + phone.substr(2, 10);
        if (phone.length == 12) phone = "0" + phone.substr(2, 11);
      }
      if (phone.length != 10) return "";

      let a = '', b = '';
      a = phone.substr(0, 3);
      b = phone.substr(0, 4);

      if (listViettel.includes(a) || listViettel.includes(b))
        return "VIETTEL";
      if (listMobi.includes(a) || listMobi.includes(b))
        return "VMS";
      if (listVina.includes(a) || listVina.includes(b))
        return "GPC";
      if (listVnMobile.includes(a) || listVnMobile.includes(b))
        return "VNM";
      if (listGMobile.includes(a) || listGMobile.includes(b))
        return "GTEL";
      if (listSFone.includes(a) || listSFone.includes(b))
        return "SFONE";
      if (listDDMobile.includes(a) || listDDMobile.includes(b))
        return "DDMBLE";
      return "";

    }
    else return result;
  }

  public addHeadPhone84(phone): string {
    if (phone != null && phone != undefined && phone != "") {
      //#region check phone 10 so, dau 0
      if (phone.length == 10 && phone.indexOf("84") != 0)
        return "84" + phone.substr(1, phone.length - 1);
      //#endregion
      //#region check phone 11 so, dau 0
      else if (phone.length == 11 && phone.indexOf("0") == 0) {
        //#region check mang VTL
        if (phone.indexOf("0162") == 0 || phone.indexOf("0163") == 0 || phone.indexOf("0164") == 0 ||
          phone.indexOf("0165") == 0 || phone.indexOf("0166") == 0 || phone.indexOf("0167") == 0 ||
          phone.indexOf("0168") == 0 || phone.indexOf("0169") == 0)
          return "843" + phone.substr(3, phone.length - 3);
        //#endregion
        //#region check mang mobi
        else if (phone.indexOf("0120") == 0) return "8470" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0121") == 0) return "8479" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0122") == 0) return "8477" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0126") == 0) return "8476" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0128") == 0) return "8478" + phone.substr(4, phone.length - 4);
        //#endregion
        //#region check mang vina
        else if (phone.indexOf("0123") == 0) return "8483" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0124") == 0) return "8484" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0125") == 0) return "8485" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0127") == 0) return "8481" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0129") == 0) return "8482" + phone.substr(4, phone.length - 4);
        //#endregion
        //#region check mang vnm
        else if (phone.indexOf("0186") == 0) return "8456" + phone.substr(4, phone.length - 4);
        else if (phone.indexOf("0188") == 0) return "8458" + phone.substr(4, phone.length - 4);
        //#endregion
        //#region check mang gtel
        else if (phone.indexOf("0199") == 0) return "8459" + phone.Substring(4, phone.length - 4);
        //#endregion
        else return phone;
      }
      //#endregion
      //#region check phone 11, so dau 84
      else if (phone.length == 12 && phone.indexOf("84") == 0) {
        //#region check mạng viettel
        if (phone.indexOf("84162") == 0 || phone.indexOf("84163") == 0 || phone.indexOf("84164") == 0 ||
          phone.indexOf("84165") == 0 || phone.indexOf("84166") == 0 || phone.indexOf("84167") == 0 ||
          phone.indexOf("84168") == 0 || phone.indexOf("84169") == 0)
          return "843" + phone.substr(4, phone.length - 4);
        // #endregion
        // #region check mạng mobifone
        else if (phone.indexOf("84120") == 0) return "8470" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84121") == 0) return "8479" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84122") == 0) return "8477" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84126") == 0) return "8476" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84128") == 0) return "8478" + phone.substr(5, phone.length - 5);
        // #endregion
        // #region check mạng vinaphone
        else if (phone.indexOf("84123") == 0) return "8483" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84124") == 0) return "8484" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84125") == 0) return "8485" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84127") == 0) return "8481" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84129") == 0) return "8482" + phone.substr(5, phone.length - 5);
        // #endregion
        // #region check mạng vietnamMobile
        else if (phone.indexOf("84186") == 0) return "8456" + phone.substr(5, phone.length - 5);
        else if (phone.indexOf("84188") == 0) return "8458" + phone.substr(5, phone.length - 5);
        // #endregion
        // #region check mạng GMobile
        else if (phone.indexOf("84199") == 0) return "8459" + phone.substr(5, phone.length - 5);
        // #endregion
        else return phone;
      }
      //#endregion
      else if (phone.length == 9)
        return "84" + phone;
      return phone;
    }
    return phone;
  }

  removeSign4VietnameseString(sms) {
    var vietnameseSigns =
      [
        "aAeEoOuUiIdDyY",
        "áàạảãâấầậẩẫăắằặẳẵ",
        "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
        "éèẹẻẽêếềệểễê",
        "ÉÈẸẺẼÊẾỀỆỂỄ",
        "óòọỏõôốồộổỗơớờợởỡ",
        "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
        "úùụủũưứừựửữ",
        "ÚÙỤỦŨƯỨỪỰỬỮ",
        "íìịỉĩ",
        "ÍÌỊỈĨ",
        "đ",
        "Đ",
        "ýỳỵỷỹ",
        "ÝỲỴỶỸ"
      ];
    for (var i = 1; i < vietnameseSigns.length; i++) {
      for (var j = 0; j < vietnameseSigns[i].length; j++)
        sms = sms.replace(vietnameseSigns[i][j], vietnameseSigns[0][i - 1]);
    }

    sms = sms.replace("–", "-")
      .replace("‘", "'")
      .replace("’", "'")
      .replace("“", "\"")
      .replace("”", "\"");

    return sms;
  }

  removeDiacritics(str) {
    var diacriticsMap = {};
    str = str.replace("–", "-")
      .replace("‘", "'")
      .replace("’", "'")
      .replace("“", "\"")
      .replace("”", "\"");

    return str.replace(/[^\u0000-\u007E]/g, function (a) {
      return diacriticsMap[a] || a;
    });
  }

  public demSoTin(input): number {
    if (input != null && input != "") {
      if (input.length < 161) return 1;
      else if (input.length > 160 && input.length < 307) return 2;
      else if (input.length > 306 && input.length < 460) return 3;
      else return 0;
    }
    else return 0;
  }

  public IsTextValidated(strTextEntry) {
    let objNotWholePattern = new RegExp("^[0-9]{9,12}$");
    return objNotWholePattern.test(strTextEntry);
  }

  public IsEmailValidated(strTextEntry) {
    let objNotWholePattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return objNotWholePattern.test(strTextEntry);
  }

  public FilterPhone(phone) {
    let str = "";
    //filter first 
    if (!this.IsTextValidated(phone)) {
      let patern = new RegExp("^[0-9]{1}$");
      for (let i in phone) {
        if (patern.test(phone[i])) {
          str += phone[i];
        }
      }
      phone = str;
    }
    //filter alter
    if (this.IsTextValidated(phone)) {
      if (phone.length == 10 && phone.indexOf("0") == 0 && phone.indexOf("01") != 0) {
        str = "84" + phone.substr(1); // Loc ky tu 0 o dau
      }
      else if (phone.length == 11 && phone.indexOf("01") == 0) {
        str = "84" + phone.substr(1); // Loc ky tu 0 o dau
      }
      else if ((phone.length == 11 || phone.length == 12) && phone.indexOf("84") == 0) {
        str = phone; // Loc ki tu 84 o dau
      }
      else {
        str = ""; // giu nguyen
      }
    }
    else {
      str = "";
    }
    return str;
  }

  public GetPhoneNew(phone) {
    let phoneNew = "";
    let b = "";

    if ((phone.length != 12 && phone.indexOf("841") == 0)) {
      return phoneNew;
    }

    if (phone.length == 12) {
      b = phone.substr(0, 5);
    }
    switch (b) {
      case "84120":
        phoneNew = "8470" + phone.substr(5);
        break;
      case "84121":
        phoneNew = "8479" + phone.substr(5);
        break;
      case "84122":
        phoneNew = "8477" + phone.substr(5);
        break;
      case "84126":
        phoneNew = "8476" + phone.substr(5);
        break;
      case "84128":
        phoneNew = "8478" + phone.substr(5);
        break;
      case "84123":
        phoneNew = "8483" + phone.substr(5);
        break;
      case "84124":
        phoneNew = "8484" + phone.substr(5);
        break;
      case "84125":
        phoneNew = "8485" + phone.substr(5);
        break;
      case "84127":
        phoneNew = "8481" + phone.substr(5);
        break;
      case "84129":
        phoneNew = "8482" + phone.substr(5);
        break;
      case "84162":
        phoneNew = "8432" + phone.substr(5);
        break;
      case "84163":
        phoneNew = "8433" + phone.substr(5);
        break;
      case "84164":
        phoneNew = "8434" + phone.substr(5);
        break;
      case "84165":
        phoneNew = "8435" + phone.substr(5);
        break;
      case "84166":
        phoneNew = "8436" + phone.substr(5);
        break;
      case "84167":
        phoneNew = "8437" + phone.substr(5);
        break;
      case "84168":
        phoneNew = "8438" + phone.substr(5);
        break;
      case "84169":
        phoneNew = "8439" + phone.substr(5);
        break;
      case "84188":
        phoneNew = "8458" + phone.substr(5);
        break;
      case "84186":
        phoneNew = "8456" + phone.substr(5);
        break;
      case "84199":
        phoneNew = "8459" + phone.substr(5);
        break;
      default:
        phoneNew = phone;
        break;
    }

    return phoneNew;
  }

  public getNameByFullName(fullName): any {
    let lastName = "";
    let firstName = "";

    // lastName = (fullName != null) ? fullName.split(' ').reverse()[0] : "";

    if (fullName != null && fullName != "" && fullName != undefined) {
      let listName = fullName.split(' ');
      let countName = listName.length;
      if (countName > 0) {
        lastName = listName[countName - 1];
        if (countName > 1) {
          for (let i = 0; i < countName - 1; i++) firstName += " " + listName[i];
        }
        else firstName = "";
      }
      return { FIRST_NAME: firstName, LAST_NAME: lastName };
    }
    else return { FIRST_NAME: firstName, LAST_NAME: lastName };
  }
}
