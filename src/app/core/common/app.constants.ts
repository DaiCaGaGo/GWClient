import { environment } from '../../../environments/environment';

export class AppConst {
    public static BASE_API = environment.base_api;
    public static GOOGLE_PROVIDER_ID = environment.google_provider_id;
    public static FACEBOOK_PROVIDER_ID = environment.facebook_provider_id;

    public static IS_LOGGED = "IS_LOGGED";
    public static CURRENT_USER = "CURRENT_USER";
    public static CURRENT_LANG = "CURRENT_LANG";
    public static ERROR_CODE = "ERROR_CODE";
    public static LANGUAGE_VI = "vi";
    public static LANGUAGE_EN = "en";

    public static DATE_FORMAT_TEMPLATE_1 = "yyyyMMdd";
    public static DATE_FORMAT_TEMPLATE_2 = "dd/MM/yyyy";
}