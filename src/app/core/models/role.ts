export class Role {
    MENU_ID: string;
    MENU_CODE: string;
    IS_ADD: boolean;
    IS_EDIT: boolean;
    IS_DELETE: boolean;
    IS_VIEW: boolean;

    constructor() {
        this.IS_ADD = false;
        this.IS_EDIT = false;
        this.IS_DELETE = false;
        this.IS_VIEW = false;
    }
}