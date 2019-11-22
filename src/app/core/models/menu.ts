export class Menu {
    ID: number;
    MENU_NAME: string;
    MENU_NAME_EN: string;
    MENU_CODE: string;
    ORD_NUMBER: number;
    PARENT_ID: number;
    MENU_PATH: string;
    MENU_ICON: string;
    CREATE_USER: string;
    EDIT_USER: string;
    IS_ACTIVE: number;

    constructor(menuName: string,
        menuNameEN: string,
        menuCode: string,
        ordNumber: number,
        parentId: number,
        menuPath: string,
        menuIcon: string,
        isActive: number) {
        this.MENU_NAME = menuName;
        this.MENU_NAME_EN = menuNameEN;
        this.MENU_CODE = menuCode,
        this.ORD_NUMBER = ordNumber;
        this.PARENT_ID = parentId;
        this.MENU_PATH = menuPath;
        this.MENU_ICON = menuIcon;
        this.IS_ACTIVE = isActive;
    }
}