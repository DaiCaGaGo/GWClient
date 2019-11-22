export class Cp {
    ID;
    NAME_SHORT;
    NAME;
    AVARTAR;
    WEBSITE;
    SKYPE;
    EMAIL;
    PHONE;
    IS_DEL;
    CREATE_DATE;
    CREATE_USER;
    EDIT_DATE;
    EDIT_USER;

    constructor(
        nameShort, 
        name, 
        avatar,
        website,
        skype,
        email,
        phone,
        createUser){
        this.NAME_SHORT = nameShort;
        this.NAME = name;
        this.AVARTAR = avatar;
        this.WEBSITE = website;
        this.SKYPE = skype;
        this.EMAIL = email;
        this.PHONE = phone;
        this.CREATE_USER = createUser;
    }
}