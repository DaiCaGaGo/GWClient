import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { AppConst } from '../common/app.constants';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private http: HttpClient,
    private utilityService: UtilityService) { }

  public get(uri: string): any {
    return this.http.get(AppConst.BASE_API + uri)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public post(uri: string, data?: any): any {
    return this.http.post(AppConst.BASE_API + uri, data)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public put(uri: string, data?: any): any {
    return this.http.put(AppConst.BASE_API + uri, data)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public delete(uri: string): any {
    return this.http.delete(AppConst.BASE_API + uri)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  public async getAsync(uri: string): Promise<any> {
    try {
      const response = await this.http.get(AppConst.BASE_API + uri).toPromise();
      return response;
    }
    catch (error) {
      console.log('getAsync.:', error);
      return null;
    }
  }

  public async postAsync(uri: string, data?: any): Promise<any> {
    try {
      const response = await this.http.post(AppConst.BASE_API + uri, data).toPromise();
      return response;
    }
    catch (error) {
      console.log('postAsync.:', error);
      return null;
    }
  }

  public async putAsync(uri: string, data?: any): Promise<any> {
    try {
      const response = await this.http.put(AppConst.BASE_API + uri, data).toPromise();
      return response;
    }
    catch (error) {
      console.log('putAsync.:', error);
      return null;
    }
  }

  public async deleteAsync(uri: string): Promise<any> {
    try {
      const response = await this.http.delete(AppConst.BASE_API + uri).toPromise();
      return response;
    }
    catch (error) {
      console.log('deleteAsync.:', error);
      return null;
    }
  }

  public async postFileAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/UploadImage", formData);
      return response;
    }
    catch (error) {
      console.log('postFileAsync.:', error);
      return null;
    }
  }

  public async importExcelAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcel", formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }

  public async importExcelBirthdaySmsAsync(postData: any, files: File[], accountId: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelBirthdaySms?accountID=" + accountId, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelBirthdaySmsAsync.:', error);
      return null;
    }
  }

  public async importExcelAndSaveAsync(postData: any, files: File[], listType: any, lstName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSave?listType=" + listType + "&lstName=" + lstName, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }

  public async importExcelAndSavePhoneListAsync(postData: any, files: File[], listType: any, lstName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSavePhoneList?listType=" + listType + "&lstName=" + lstName, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }

  public async importExcelAndSaveAsync1(postData: any, files: File[], listType: any, lstName: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelAndSave1?listType=" + listType + "&lstName=" + lstName, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }

  public async getDataFromExcelAsync(postData: any, files: File[]) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/GetDataFromExcel", formData);
      return response;
    }
    catch (error) {
      console.log('getDataFromExcelAsync.:', error);
      return null;
    }
  }

  public async getFileExtentionAsync(uri: string, objectName: string, fileName?: string): Promise<boolean> {
    let result: boolean = false;
    if (!fileName) {
      fileName = objectName + '_' + this.utilityService.formatDateToString(new Date(), 'yyyyMMddhhmmsss');
    }
    let url = AppConst.BASE_API + uri + '?objectName=' + objectName + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsCustomizeAsync(uri: string, listID: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?listID=' + listID + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionCampaignApproveAsync(uri: string, campaignID: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?campaignID=' + campaignID + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionCustomerAsync(uri: string, accountId: any, fullName: string, ngaySinh: any,
    phone: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?accountId=' + accountId + '&fullName=' + fullName +
      '&ngaySinh=' + ngaySinh + '&phone=' + phone + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionDataCampaignDetailAsync(uri: string, data_campaign_id: any
    , fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?&data_campaign_id=' + data_campaign_id;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsErrorAsync(uri: string, accountId: any, sender_name: string, sms_content: string, phone: string,
    sms_type: any, viettel: string, vina: string, mobi: string, vnMobile: string, gtel: string, sfone: string, tu_ngay: string,
    den_ngay: string, partner_code: string, receive_result: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?accountId=' + accountId + '&sender_name=' + sender_name + '&sms_content=' + sms_content
      + '&phone=' + phone + '&sms_type=' + sms_type + '&viettel=' + viettel + '&vina=' + vina + '&mobi=' + mobi + '&vnMobile=' + vnMobile
      + '&gtel=' + gtel + '&sfone=' + sfone + '&tu_ngay=' + tu_ngay + '&den_ngay=' + den_ngay + '&partner_code=' + partner_code
      + '&receive_result=' + receive_result;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionPhoneListAsync(uri: string, phoneList: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?phoneList=' + phoneList + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionSmsByBrandnameAsync(uri: string, listSms: any, fileName: string): Promise<boolean> {
    let result: boolean = false;
    debugger
    let url = AppConst.BASE_API + uri + '?listSms=' + listSms + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getAllFileExtentionAsync(uri: string, objectName: string): Promise<boolean> {
    let result: boolean = false;
    let user = JSON.parse(localStorage.getItem(AppConst.CURRENT_USER));
    let fileName = objectName + '_' + this.utilityService.formatDateToString(new Date(), 'yyyyMMddhhmmsss');
    let url = AppConst.BASE_API + uri + '?objectName=' + objectName + '&fileName=' + fileName;
    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.TOKEN}`
      }
    }).then(response => response.blob())
      .then(blob => {
        if (blob) {
          saveAs(blob, fileName);
          result = true;
        }
        else {
          console.log('getFileExtentionAsync.: không có dữ liệu');
          result = false;
        }
      })
      .catch((err) => {
        console.log('getFileExtentionAsync.:', err);
        result = false;
      });
    return result;
  }

  public async getFileExtentionSmsStatisticAsync(uri: string, accountId: any, sender_name: string, sms_content: string, phone: string,
    sms_type: any, viettel: string, vina: string, mobi: string, vnMobile: string, gtel: string, sfone: string, ddMobile: string, tu_ngay: string,
    den_ngay: string, partner_code: string, receive_result: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?accountId=' + accountId + '&sender_name=' + sender_name + '&sms_content=' + sms_content
      + '&phone=' + phone + '&sms_type=' + sms_type + '&viettel=' + viettel + '&vina=' + vina + '&mobi=' + mobi + '&vnMobile=' + vnMobile
      + '&gtel=' + gtel + '&sfone=' + sfone + '&ddMobile=' + ddMobile + '&tu_ngay=' + tu_ngay + '&den_ngay=' + den_ngay + '&partner_code=' + partner_code
      + '&receive_result=' + receive_result + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getFileExtentionParameterAsync(uri: string, objectName: string, listParameter: string, fileName: string): Promise<boolean> {
    let result: boolean = false;
    let url = AppConst.BASE_API + uri + '?objectName=' + objectName + '&listParameter=' + listParameter + '&fileName=' + fileName;
    let response = await this.http.get(url, { responseType: 'arraybuffer' }).toPromise();
    if (response) {
      let blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  public async getAccountDetail(): Promise<any> {
    try {
      const response = await this.http.get(AppConst.BASE_API + '/api/account/GetInfoAccountLogin').toPromise();
      return response;
    }
    catch (error) {
      console.log('getAsync.:', error);
      return null;
    }
  }

  public async importExcelCustomer(postData: any, files: File[], accountID: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelCustomer?accountID=" + accountID, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }

  public async importExcelCustomerInGroup(postData: any, files: File[], accountID: any, groupID: any) {
    try {
      let formData: FormData = new FormData();
      formData.append('files', files[0], files[0].name);
      if (postData !== "" && postData !== undefined && postData !== null) {
        for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
            formData.append(property, postData[property]);
          }
        }
      }
      const response = await this.postAsync("/api/FileExtention/ImportExcelCustomerInGroup?accountID=" + accountID + '&groupID=' + groupID, formData);
      return response;
    }
    catch (error) {
      console.log('importExcelAsync.:', error);
      return null;
    }
  }
}
