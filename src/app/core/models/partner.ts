export class Partner {
    ID;
    PARTNER_CODE;
    PARTNER_NAME;
    DESCRIPTION;
    REQUEST_BY_HTTP;
    REQUEST_BY_SMPP;
    URL_HTTP_1_CSKH;
    URL_HTTP_2_CSKH;
    URL_HTTP_3_CSKH;
    HTTP_USER_CSKH;
    HTTP_PASS_CSKH;
    HTTP_ENCODE_CSKH;
    SMPP_IP_1;
    SMPP_PORT_1;
    SMPP_IP_2;
    SMPP_PORT_2;
    SMPP_USER;
    SMPP_PASS;
    DLVR;
    DLVR_URL;
    PUSH_SMS_QC_BY;
    URL_HTTP_1_QC;
    URL_HTTP_2_QC;
    URL_HTTP_3_QC;
    HTTP_USER_QC;
    HTTP_PASS_QC;
    HTTP_ENCODE_QC;
    RECEIVE_EMAIL_QC;
    CREATE_DATE;
    CREATE_USER;
    EDIT_DATE;
    EDIT_USER;
    IS_DEL;
    
    constructor(
        partnerCode,
        partnerName,
        description,
        requestHTTP,
        requestSMPP,
        UrlHttpCskh1,
        UrlHttpCskh2,
        UrlHttpCskh3,
        userAPI,
        passwordAPI,
        endcodeCSKH,
        smppIp_1,
        smppPort_1,
        smppIp_2,
        smppPort_2,
        userSMPP,
        passwordSMPP,
        //pushSMSQC,
        APIQC_1,
        APIQC_2,
        APIQC_3,
        userAPIQC,
        passwordAPIQC,
        endcodeQC,
        emailReceive,
        user_name) {
        this.PARTNER_CODE = partnerCode;
        this.PARTNER_NAME = partnerName;
        this.DESCRIPTION = description;
        this.REQUEST_BY_HTTP = requestHTTP;
        this.REQUEST_BY_SMPP = requestSMPP;
        this.URL_HTTP_1_CSKH = UrlHttpCskh1;
        this.URL_HTTP_2_CSKH = UrlHttpCskh2;
        this.URL_HTTP_3_CSKH = UrlHttpCskh3;
        this.HTTP_USER_CSKH = userAPI;
        this.HTTP_PASS_CSKH = passwordAPI;
        this.HTTP_ENCODE_CSKH = endcodeCSKH;
        this.SMPP_IP_1 = smppIp_1;
        this.SMPP_PORT_1 = smppPort_1;
        this.SMPP_IP_2 = smppIp_2;
        this.SMPP_PORT_2 = smppPort_2;
        this.SMPP_USER = userSMPP;
        this.SMPP_PASS = passwordSMPP;
        //this.PUSH_SMS_QC_BY = emailReceive;
        this.URL_HTTP_1_QC = APIQC_1;
        this.URL_HTTP_2_QC = APIQC_2;
        this.URL_HTTP_3_QC = APIQC_3;
        this.HTTP_USER_QC = userAPIQC;
        this.HTTP_PASS_QC = passwordAPIQC;
        this.HTTP_ENCODE_QC = endcodeQC;
        this.RECEIVE_EMAIL_QC = emailReceive;
        this.CREATE_USER = user_name;
    }    
}