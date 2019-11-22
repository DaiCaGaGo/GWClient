export class User {
    ACCOUNT_ID: string;
    USER_NAME: string;
    PASSWORD: string;
    FULL_NAME: string;
    LAST_NAME: string;
    TOKEN: string;
    AVATAR: string;
    PROVIDER: string;
    TIME_OUT: string;

    constructor(id, username, password, fullname, token, avatar, provider, timeout?) {
        this.ACCOUNT_ID = id;
        this.USER_NAME = username;
        this.PASSWORD = password;
        this.FULL_NAME = fullname;
        this.TOKEN = token;
        this.LAST_NAME = (fullname != null) ? fullname.split(' ').reverse()[0] : "";
        this.AVATAR = (avatar == "") ? "../../assets/img/img.jpg" : avatar;
        this.PROVIDER = provider;
        this.TIME_OUT = timeout;
    }
}