import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Pagination } from '../../../core/models/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { FormGroup, FormControl} from '@angular/forms';
import { UtilityService } from 'src/app/core/services/utility.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from 'src/app/core/models/role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prg-short-number',
  templateUrl: './prg-short-number.component.html',
  styleUrls: ['./prg-short-number.component.css']
})

export class PrgShortNumberComponent implements OnInit {
  @ViewChild('confirmDeleteModal', { static: false }) public confirmDeleteModal: ModalDirective;
  @ViewChild('createNewModal', { static: false }) public createNewModal: ModalDirective;
  @ViewChild('editThisModal', { static: false }) public editThisModal: ModalDirective;
  @ViewChild('confirmDeleteMultiModal', { static: false }) public confirmDeleteMultiModal: ModalDirective;
  @ViewChild('chooseProgamType', { static: false }) public chooseProgamType;

  public smsMT = ""
  public smsBefore = ""
  public smsAfter = ""
  public timeBegin = ""
  public timeEnd = ""

  public dataPrgShortNumber;
  public shortNumber = [];
  public formEditPrgShortNumber: FormGroup;
  public pagination: Pagination = new Pagination();
  public settingsFilterAccount = {};
  public settingsFilterShortNumber = {};
  public dataCombobox = [];
  public dataComboboxedit = [];
  public accountid: number = 0;
  public PrgShortNumberId;
  public Full_Name;
  public selectedItemComboboxAccount = [];
  public selectedItemComboboxAccountAdd = [];
  public selectedItemComboboxShortNumber = [];
  public selectedItemComboboxShortNumberAdd = [];

  public name_fillter: string = "";
  public short_number_fillter: string = "";
  public program_code_fillter: string = "";
  public program_format_fillter: string = "";
  public begin_date_fillter: string = "";
  public end_date_fillter: string = "";
  public beginDateSearch = "";
  public endDateSearch = "";

  public arrPRG_OPTION: object[] = [];
  public arrPRG_MO_MT: object[] = [];
  public isVOTEedit = false;
  public arrPRG_OPTIONedit: object[] = [];
  public arrPRG_MO_MTedit: object[] = [];

  public isDisableHeader = false;
  public role: Role = new Role();

  public settingsFilterProgramType = {};
  public listProgramType = [];
  public selectedProgramType = [];
  public settingsFilterProgramTypeEdit = {}

  public isChooseTran = false;
  public isChooseVote = true;

  public tranUrl = ""
  public tranUser = ""
  public tranPass = ""
  public tranTimeout = ""
  public programName = ""

  public settingsFilterVoteType = {}
  public listVoteType = []
  public selectedVoteType = []
  public placeHolderFomat = ""

  public prFormat = ""
  public prMT_Error = ""
  public limitMO_Phone = ""

  public autoMO = ""
  public autoMT = ""

  public optionAnser = ""
  public optionAnserTitle = ""

  constructor(private dataService: DataService,
    private utilityService: UtilityService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService) {

    this.activatedRoute.data.subscribe(data => {
      this.utilityService.getRole(data.MENU_CODE).then((response) => {
        if (response) this.role = response;
      })
    });

    this.settingsFilterProgramType = {
      text: this.utilityService.translate("prg_short_number.choose_type"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
      // showCheckbox: false
    };

    this.settingsFilterProgramTypeEdit = {
      text: this.utilityService.translate("prg_short_number.choose_type"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: false,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    }

    this.settingsFilterVoteType = {
      text: this.utilityService.translate("prg_short_number.choose_vote_type"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.formEditPrgShortNumber = new FormGroup({
      id: new FormControl(),
      cbAccountEdit: new FormControl(),
      programName: new FormControl(),
      cbShortNumber: new FormControl(),
      programType: new FormControl(),

      tranUrl: new FormControl(),
      tranUser: new FormControl(),
      tranPass: new FormControl(),
      tranTimeout: new FormControl(),

      voteType: new FormControl(),
      prFormat: new FormControl(),
      prMT_Error: new FormControl(),
      limitMO_Phone: new FormControl(),

      checkCreateCode: new FormControl(),
      headerCodeMT: new FormControl(),
      lengthCodeMT: new FormControl(),
      programCode: new FormControl(),

      beginDate: new FormControl(),
      contentBefore: new FormControl(),
      endDate: new FormControl(),
      contentAfter: new FormControl(),
      contentMT: new FormControl(),

      autoMO: new FormControl(),
      autoMT: new FormControl(),
      optionAnser: new FormControl(),
      optionAnserTitle: new FormControl()
    });

    this.shortNumber = [
      { "id": 8088, "itemName": "8088" },
      { "id": 8188, "itemName": "8188" },
      { "id": 8288, "itemName": "8288" },
      { "id": 8388, "itemName": "8388" },
      { "id": 8488, "itemName": "8488" },
      { "id": 8588, "itemName": "8588" },
      { "id": 8688, "itemName": "8688" },
      { "id": 8788, "itemName": "8788" }
    ];

    this.settingsFilterAccount = {
      text: this.utilityService.translate("global.choose_account"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };

    this.settingsFilterShortNumber = {
      text: this.utilityService.translate("prg_short_number.choose_number"),
      singleSelection: true,
      enableSearchFilter: true,
      enableFilterSelectAll: true,
      searchPlaceholderText: this.utilityService.translate("global.search"),
      noDataLabel: this.utilityService.translate("global.no_data")
    };
  }

  ngOnInit() {
    this.bindDataToCombobox();
    this.getDataPrgShortNumber();
    this.loadProgramType()
    this.loadVoteType()
  }

  onItemSelectShortNumber() {
    this.getDataPrgShortNumber();
  }

  //#region load list program type
  loadProgramType() {
    this.listProgramType = [];
    this.selectedProgramType = [];
    this.listProgramType.push({ "id": "VOTE", "itemName": "VOTE" });
    this.listProgramType.push({ "id": "TRAN", "itemName": "TRAN" });
    this.selectedProgramType.push({ "id": this.listProgramType[0].id, "itemName": this.listProgramType[0].itemName })
  }

  onChangeProgramType() {
    if (this.selectedProgramType.length > 0) {
      if (this.selectedProgramType[0].id == "VOTE") {
        this.isChooseTran = false;
        this.isChooseVote = true;
      }
      else if (this.selectedProgramType[0].id == "TRAN") {
        this.isChooseTran = true;
        this.isChooseVote = false;
      }
    }
  }
  //#endregion

  //#region load vote type
  loadVoteType() {
    this.listVoteType = []
    this.selectedVoteType = []
    this.listVoteType.push({ "id": "VOTE_AND_GENCODE", "itemName": "VOTE_AND_GENCODE" })
    this.listVoteType.push({ "id": "VOTE_AND_ANSERRIGHT", "itemName": "VOTE_AND_ANSERRIGHT" })
    this.selectedVoteType.push({ "id": this.listVoteType[0].id, "itemName": this.listVoteType[0].itemName })
    this.onChangeVoteType();
  }

  onChangeVoteType() {
    if (this.selectedVoteType.length > 0) {
      if (this.selectedVoteType[0].id == "VOTE_AND_GENCODE") this.placeHolderFomat = "ABC X"
      else if (this.selectedVoteType[0].id == "VOTE_AND_ANSERRIGHT") this.placeHolderFomat = "ABC X Y"
    }
    else this.placeHolderFomat = ""
  }
  //#endregion

  //#region load account
  public async bindDataToCombobox() {
    let result = await this.dataService.getAsync('/api/account/GetInfoAccountLogin');
    let is_admin = result.data[0].IS_ADMIN;
    if (is_admin != null && is_admin == 1) {
      let response: any = await this.dataService.getAsync('/api/account');
      for (let index in response.data) {
        this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
    }
    else {
      let response = await this.dataService.getAsync('/api/account/GetLisAccountParentAndChild?account_id=' +
        this.authService.currentUserValue.ACCOUNT_ID);
      for (let index in response.data) {
        this.dataCombobox.push({ "id": response.data[index].ACCOUNT_ID, "itemName": response.data[index].USER_NAME });
      }
      if (this.dataCombobox.length == 1)
        this.selectedItemComboboxAccount.push({ "id": this.dataCombobox[0].id, "itemName": this.dataCombobox[0].itemName });
      else
        this.selectedItemComboboxAccount.push({ "id": 0, "itemName": "Chọn tài khoản" });
    }
  }

  onItemSelect() {
    this.getDataPrgShortNumber();
  }
  //#endregion

  //#region check tạo mã tự động
  checkDisable(isChecked) {
    if (isChecked) this.isDisableHeader = false;
    else this.isDisableHeader = true;
  }
  //#endregion

  //#region change date time
  onChangeBeginDate(event) {
    this.beginDateSearch = event != "Invalid Date" && event != undefined && event != "" ?
      this.utilityService.formatDateToString(event, "yyyyMMdd") : ""
    if (this.beginDateSearch > this.endDateSearch && this.endDateSearch != "") {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getDataPrgShortNumber();
  }

  onChangeEndDate(event) {
    this.endDateSearch = event != "Invalid Date" && event != undefined && event != "" ?
      this.utilityService.formatDateToString(event, "yyyyMMdd") : ""
    if (this.beginDateSearch > this.endDateSearch) {
      this.notificationService.displayWarnMessage("Ngày tin nhắn chưa thỏa mãn");
      return;
    }
    this.getDataPrgShortNumber();
  }
  //#endregion

  //#region load data table
  async getDataPrgShortNumber() {
    let accountId = this.selectedItemComboboxAccount.length > 0 ? this.selectedItemComboboxAccount[0].id : "";
    let shortNumber = this.selectedItemComboboxShortNumber.length > 0 ? this.selectedItemComboboxShortNumber[0].id : "";
    let response: any = await this.dataService.getAsync('/api/PrgShortNumber/GetPrgShortNumberFillterAndPaging?pageIndex=' +
      this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize + '&accountid=' + accountId +
      '&name=' + this.name_fillter + '&short_number=' + shortNumber + '&program_code=' + this.program_code_fillter +
      '&program_format=' + this.program_format_fillter + '&begin_date=' + this.beginDateSearch + '&end_date=' + this.endDateSearch)
    if (response) {
      this.loadData(response);
    }
  }

  loadData(response?: any) {
    if (response) {
      this.dataPrgShortNumber = response.data;
      if ('pagination' in response) {
        this.pagination.pageSize = response.pagination.PageSize;
        this.pagination.totalRow = response.pagination.TotalRows;
      }
    }
  }

  setPageIndex(pageNo: number): void {
    this.pagination.pageIndex = pageNo;
    this.getDataPrgShortNumber();
  }

  pageChanged(event: any): void {
    this.setPageIndex(event.page);
  }

  changePageSize(size) {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1;
    this.getDataPrgShortNumber();
  }
  //#endregion

  //#region create prg short number
  async createNewPRG() {
    this.programName = ""
    this.tranUrl = ""
    this.tranUser = ""
    this.tranPass = ""
    this.tranTimeout = ""

    this.prFormat = ""
    this.prMT_Error = ""
    this.limitMO_Phone = ""

    this.smsBefore = ""
    this.smsMT = ""
    this.smsAfter = ""
    this.timeBegin = ""
    this.timeEnd = ""

    this.createNewModal.show();
    this.checkDisable(false);
  }

  public async createPrgShortNumber(prgshortnumbers) {
    let data = prgshortnumbers.value;
    if (this.selectedItemComboboxAccountAdd == null || this.selectedItemComboboxAccountAdd.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = this.selectedItemComboboxAccountAdd[0].id;

    if (this.selectedItemComboboxShortNumberAdd == null || this.selectedItemComboboxShortNumberAdd.length == 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-66"));
      return;
    }
    let SHORT_NUMBER = this.selectedItemComboboxShortNumberAdd[0].id;

    let NAME = data.programName;
    if (NAME == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-65"));
      return;
    }

    if (this.selectedProgramType.length == 0) {
      this.notificationService.displayWarnMessage("Loại chương trình không được để trống");
      return;
    }
    let PROGRAM_TYPE = this.selectedProgramType[0].id;

    //#region TRAN
    let URL_TRAN = data.tranUrl;
    let USER_TRAN = data.tranUser;
    let PASS_TRAN = data.tranPass;
    let TIME_OUT_TRAN = data.tranTimeout;
    //#endregion

    //#region VOTE
    let PROGRAM_FORMAT = "";
    let VOTE_TYPE = "";
    if (PROGRAM_TYPE == "VOTE") {
      if (this.selectedVoteType.length == 0) {
        this.notificationService.displayWarnMessage("Loại bình chọn không được để trống");
        return;
      }
      VOTE_TYPE = this.selectedVoteType[0].id;

      PROGRAM_FORMAT = data.prFormat;
      if (PROGRAM_FORMAT == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-69"));
        return;
      }
    }

    let MT_ERROR = data.prMT_Error != undefined ? data.prMT_Error : ""
    let LIMIT_MO_PHONE = data.limitMO_Phone != undefined ? data.limitMO_Phone : ""
    let CODE_IN_MT = data.checkCreateCode != undefined && data.checkCreateCode == true ? 1 : 0;
    let CODE_HEADER_MT = data.headerCodeMT != undefined ? data.headerCodeMT : ""
    let CODE_LENGTH_MT = data.lengthCodeMT != undefined ? data.lengthCodeMT : ""
    let AUTO_MT = PROGRAM_TYPE == "VOTE" ? this.smsMT : ""

    let timeBegin = PROGRAM_TYPE == "VOTE" ? this.timeBegin : ""
    let BEGIN_DATE = ""
    let BEGIN_TIME = ""
    if (timeBegin != "Invalid date" && timeBegin != undefined && timeBegin != "") {
      BEGIN_DATE = this.utilityService.formatDateToString(timeBegin, "yyyyMMdd")
      BEGIN_TIME = this.utilityService.formatDateToString(timeBegin, "HH:mm")
    }
    let BEFORE_START_MT = PROGRAM_TYPE == "VOTE" ? this.smsBefore : ""

    let timeEnd = PROGRAM_TYPE == "VOTE" ? this.timeEnd : ""
    let END_DATE = "";
    let END_TIME = "";
    if (timeEnd != "Invalid date" && timeEnd != undefined && timeEnd != "") {
      END_DATE = this.utilityService.formatDateToString(timeEnd, "yyyyMMdd")
      END_TIME = this.utilityService.formatDateToString(timeEnd, "HH:mm")
    }
    let OUT_OF_TIME_MT = PROGRAM_TYPE == "VOTE" ? this.smsAfter : ""
    //#endregion

    let dataInsert = await this.dataService.postAsync('/api/prgshortnumber', {
      ACCOUNT_ID, NAME, SHORT_NUMBER, LIMIT_MO_PHONE, PROGRAM_FORMAT, PROGRAM_TYPE,
      AUTO_MT, CODE_IN_MT, CODE_HEADER_MT, CODE_LENGTH_MT, BEFORE_START_MT, OUT_OF_TIME_MT, VOTE_TYPE,
      BEGIN_DATE, BEGIN_TIME, END_DATE, END_TIME, URL_TRAN, USER_TRAN, PASS_TRAN, TIME_OUT_TRAN, MT_ERROR
    });
    if (dataInsert.err_code == 0) {
      let programID = dataInsert.data[0].ID;
      //#region create autoMT
      let PRG_ID = programID;
      for (let i in this.arrPRG_MO_MT) {
        let obj: any = this.arrPRG_MO_MT[i];
        let MO = obj.MO;
        let MT = obj.MT;
        if (MO == "") {
          this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-71"));
          return;
        }
        let response = await this.dataService.postAsync('/api/prgshortnumberautomt', { PRG_ID, MO, MT });
      }
      //#endregion

      //#region create option neu la VOTE
      if (PROGRAM_TYPE == "VOTE") {
        let PROGRAM_ID = programID
        for (let i in this.arrPRG_OPTION) {
          let obj: any = this.arrPRG_OPTION[i];
          let ANSER = obj.ANSER;
          let ANSER_TITLE = obj.ANSER_TITLE;
          let response = await this.dataService.postAsync('/api/prgshortnumberoption', { PROGRAM_ID, ANSER, ANSER_TITLE });
          if (response.err_code != 0) {
            this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("110"));
            return;
          }
        }
      }
      //#endregion

      this.notificationService.displaySuccessMessage(dataInsert.err_code);
    }
    else {
      this.notificationService.displayErrorMessage(dataInsert.err_code);
    }

    this.createNewModal.hide();
    this.getDataPrgShortNumber();
  }
  //#endregion

  //#region edit
  async showConfirmEditPrgShortNumber(id) {
    let response: any = await this.dataService.getAsync('/api/prgshortnumber/' + id)
    if (response.err_code == 0) {
      let dataPrgShortNumber = response.data[0];
      let dateBegin = this.convertStringDate(dataPrgShortNumber.BEGIN_DATETIME).toString()
      let dateEnd = this.convertStringDate(dataPrgShortNumber.END_DATETIME).toString()

      let isCreateCodeAuto = dataPrgShortNumber.CODE_IN_MT
      if (isCreateCodeAuto == 1) this.isDisableHeader = false;
      else this.isDisableHeader = true;

      if (dataPrgShortNumber.PROGRAM_TYPE == "VOTE") {
        this.isChooseTran = false;
        this.isChooseVote = true;
      }
      else {
        this.isChooseVote = false;
        this.isChooseTran = true;
      }

      this.formEditPrgShortNumber = new FormGroup({
        id: new FormControl(id),
        cbAccountEdit: new FormControl([{ "id": dataPrgShortNumber.ACCOUNT_ID, "itemName": dataPrgShortNumber.USER_NAME }]),
        cbShortNumber: new FormControl([{ "id": dataPrgShortNumber.SHORT_NUMBER, "itemName": dataPrgShortNumber.SHORT_NUMBER }]),
        programName: new FormControl(dataPrgShortNumber.NAME),
        programType: new FormControl(dataPrgShortNumber.PROGRAM_TYPE != undefined && dataPrgShortNumber.PROGRAM_TYPE != "" ?
          [{ "id": dataPrgShortNumber.PROGRAM_TYPE, "itemName": dataPrgShortNumber.PROGRAM_TYPE }] : []),

        tranUrl: new FormControl(dataPrgShortNumber.URL_TRAN),
        tranUser: new FormControl(dataPrgShortNumber.USER_TRAN),
        tranPass: new FormControl(dataPrgShortNumber.PASS_TRAN),
        tranTimeout: new FormControl(dataPrgShortNumber.TIME_OUT_TRAN),

        voteType: new FormControl((dataPrgShortNumber.VOTE_TYPE != null && dataPrgShortNumber.VOTE_TYPE != "") ?
          [{ "id": dataPrgShortNumber.VOTE_TYPE, "itemName": dataPrgShortNumber.VOTE_TYPE }] : []),
        prFormat: new FormControl(dataPrgShortNumber.PROGRAM_FORMAT),
        prMT_Error: new FormControl(dataPrgShortNumber.MT_ERROR),
        limitMO_Phone: new FormControl(dataPrgShortNumber.LIMIT_MO_PHONE),

        checkCreateCode: new FormControl(isCreateCodeAuto),
        headerCodeMT: new FormControl(dataPrgShortNumber.CODE_HEADER_MT),
        lengthCodeMT: new FormControl(dataPrgShortNumber.CODE_LENGTH_MT),
        programCode: new FormControl(dataPrgShortNumber.PROGRAM_CODE),

        beginDate: new FormControl(dateBegin),
        contentBefore: new FormControl(dataPrgShortNumber.BEFORE_START_MT),
        endDate: new FormControl(dateEnd),
        contentAfter: new FormControl(dataPrgShortNumber.OUT_OF_TIME_MT),
        contentMT: new FormControl(dataPrgShortNumber.AUTO_MT),

        autoMO: new FormControl(""),
        autoMT: new FormControl(""),
        optionAnser: new FormControl(""),
        optionAnserTitle: new FormControl("")
      });
      this.loadDataPRG_AUTOMT(id);
      if (this.isChooseVote) this.loadDataPRG_OPTION(id);
      this.editThisModal.show();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }

  async loadDataPRG_AUTOMT(PRGID) {
    let respone = await this.dataService.getAsync('/api/prgshortnumberautomt/GetListByPrgId?prg_id=' + PRGID);
    if (respone.err_code == 0) {
      this.arrPRG_MO_MTedit = respone.data;
    }
  }

  async loadDataPRG_OPTION(PRGID) {
    let respone = await this.dataService.getAsync('/api/prgshortnumberoption/GetListByPrgId?prg_id=' + PRGID);
    if (respone.err_code == 0) {
      this.arrPRG_OPTIONedit = respone.data;
    }
  }

  async editPrgShortNumber() {
    let dataPrgShortNumber = this.formEditPrgShortNumber.controls;
    let ID = dataPrgShortNumber.id.value;
    if (dataPrgShortNumber.cbAccountEdit == null || dataPrgShortNumber.cbAccountEdit.value[0].length > 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-68"));
      return;
    }
    let ACCOUNT_ID = dataPrgShortNumber.cbAccountEdit.value[0].id;

    let NAME = dataPrgShortNumber.programName.value;
    if (NAME == "") {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-65"));
      return;
    }

    if (dataPrgShortNumber.cbShortNumber == null || dataPrgShortNumber.cbShortNumber.value[0].length > 0) {
      this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-66"));
      return;
    }
    let SHORT_NUMBER = dataPrgShortNumber.cbShortNumber.value[0].id;

    if (dataPrgShortNumber.programType.value.length == 0) {
      this.notificationService.displayWarnMessage("Bạn phải chọn loại chương trình");
      return;
    }
    let PROGRAM_TYPE = dataPrgShortNumber.programType.value[0].id;

    //#region TRAN
    let URL_TRAN = dataPrgShortNumber.tranUrl.value;
    let USER_TRAN = dataPrgShortNumber.tranUser.value;
    let PASS_TRAN = dataPrgShortNumber.tranPass.value;
    let TIME_OUT_TRAN = dataPrgShortNumber.tranTimeout.value;
    //#endregion

    //#region VOTE
    let PROGRAM_FORMAT = "";
    let VOTE_TYPE = "";
    if (PROGRAM_TYPE == "VOTE") {
      if (dataPrgShortNumber.voteType.value.length == 0) {
        this.notificationService.displayWarnMessage("Loại bình chọn không được để trống");
        return;
      }
      VOTE_TYPE = dataPrgShortNumber.voteType.value[0].id

      PROGRAM_FORMAT = dataPrgShortNumber.prFormat.value;
      if (PROGRAM_FORMAT == "") {
        this.notificationService.displayWarnMessage(this.utilityService.getErrorMessage("-69"));
        return;
      }
    }

    let PROGRAM_CODE = dataPrgShortNumber.programCode.value
    let MT_ERROR = dataPrgShortNumber.prMT_Error.value
    let LIMIT_MO_PHONE = dataPrgShortNumber.limitMO_Phone.value
    let CODE_IN_MT = dataPrgShortNumber.checkCreateCode.value == true ? 1 : 0;
    let CODE_HEADER_MT = dataPrgShortNumber.headerCodeMT.value
    let CODE_LENGTH_MT = dataPrgShortNumber.lengthCodeMT.value

    let AUTO_MT = dataPrgShortNumber.contentMT.value

    let timeBegin = dataPrgShortNumber.beginDate.value
    let BEGIN_DATE = ""
    let BEGIN_TIME = ""

    if (timeBegin != "Invalid date" && timeBegin != undefined && timeBegin != "") {
      BEGIN_DATE = this.utilityService.formatDateToString(timeBegin, "yyyyMMdd")
      BEGIN_TIME = this.utilityService.formatDateToString(timeBegin, "HH:mm")
    }
    let BEFORE_START_MT = dataPrgShortNumber.contentBefore.value

    let timeEnd = dataPrgShortNumber.endDate.value
    let END_DATE = "";
    let END_TIME = "";
    if (timeEnd != "Invalid date" && timeEnd != undefined && timeEnd != "") {
      END_DATE = this.utilityService.formatDateToString(timeEnd, "yyyyMMdd")
      END_TIME = this.utilityService.formatDateToString(timeEnd, "HH:mm")
    }
    let OUT_OF_TIME_MT = dataPrgShortNumber.contentAfter.value

    //#endregion

    let response: any = await this.dataService.putAsync('/api/prgshortnumber/' + ID, {
      ACCOUNT_ID, NAME, SHORT_NUMBER, PROGRAM_CODE, LIMIT_MO_PHONE,
      PROGRAM_FORMAT, PROGRAM_TYPE, AUTO_MT, CODE_IN_MT, CODE_HEADER_MT,
      CODE_LENGTH_MT, BEFORE_START_MT, OUT_OF_TIME_MT, VOTE_TYPE, BEGIN_DATE,
      BEGIN_TIME, END_DATE, END_TIME, URL_TRAN, USER_TRAN, PASS_TRAN, TIME_OUT_TRAN, MT_ERROR
    });

    if (response.err_code == 0) {
      //#region xóa tin nhắn MT tự động va insert moi
      let deleteAutoMT = await this.dataService.deleteAsync('/api/PrgShortNumberAutoMt/DeleteAutoMtByProgramID?programID=' + ID);
      if (deleteAutoMT.err_code == 0) {
        let PRG_ID = ID
        for (let i in this.arrPRG_MO_MTedit) {
          let obj: any = this.arrPRG_MO_MTedit[i];
          let MO = obj.MO;
          let MT = obj.MT;
          this.dataService.postAsync('/api/prgshortnumberautomt', { PRG_ID, MO, MT });
        }
      }
      //#endregion

      //#region xóa danh sách mã bình chọn và insert dữ liệu mới
      if (PROGRAM_TYPE == "VOTE") {
        let deleteOption = await this.dataService.deleteAsync('/api/PrgShortNumberOption/DeleteOptionByProgramID?programID=' + ID);
        if (deleteOption.err_code == 0) {
          let PROGRAM_ID = ID;
          for (let i in this.arrPRG_OPTIONedit) {
            let obj: any = this.arrPRG_OPTIONedit[i];
            let ANSER = obj.ANSER;
            let ANSER_TITLE = obj.ANSER_TITLE;
            this.dataService.postAsync('/api/prgshortnumberoption', { PROGRAM_ID, ANSER, ANSER_TITLE });
          }
        }
      }

      //#endregion
      this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("300"));
      this.editThisModal.hide();
      this.getDataPrgShortNumber();
    } else {
      this.notificationService.displayErrorMessage(response.err_message);
    }
  }
  //#endregion

  //#region common
  public convertStringDate(text: string): string {
    let value = "";
    let nam = "", thang = "", ngay = "";
    let gio = ""
    if (text != "" && text != null) {
      nam = text.substring(0, 4);
      thang = text.substring(4, 6);
      ngay = text.substring(6, 8);
      if (text.length > 10) gio = text.substr(8, 13)
      value = ngay + "/" + thang + "/" + nam + " " + gio;
    }
    return value;
  }
  //#endregion

  //#region delete
  showConfirmDeletePrgShortNumber(feeid, full_name) {
    this.PrgShortNumberId = feeid;
    this.Full_Name = full_name;
    this.confirmDeleteModal.show();
  }

  deletePrgShortNumber(prgshortnumberid) {
    this.PrgShortNumberId = prgshortnumberid;
    this.dataService.delete('/api/prgshortnumber/' + prgshortnumberid + "?pageIndex=" + this.pagination.pageIndex + '&pageSize=' + this.pagination.pageSize)
      .subscribe((response: any) => {
        if (response.err_code == 0) {
          this.confirmDeleteModal.hide();
          this.notificationService.displaySuccessMessage(this.utilityService.getErrorMessage("200"));
          this.getDataPrgShortNumber();
        }
        else {
          this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("-48"));
        }
      }, error => {
        console.log(error);
        this.notificationService.displayErrorMessage(this.utilityService.getErrorMessage("110"));
      });
  }
  //#endregion

  //#region tạo PRG MO MT
  addNewPRG_MO_MT(detail) {
    let mo = detail.MO;
    let mt = detail.MT;
    if (mo == "" && mt == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập nội dung");
      return
    }
    for (let i in this.arrPRG_MO_MT) {
      let obj: any = this.arrPRG_MO_MT[i]
      if (detail.MO == obj.MO) {
        this.notificationService.displayWarnMessage("Nội dung MO không trùng nhau");
        return;
      }
    }
    this.arrPRG_MO_MT.push({ MO: mo, MT: mt });
    this.autoMO = ""
    this.autoMT = ""
  }

  deletePRG_MO_MT(index) {
    this.notificationService.displayConfirmDialog("Bạn có chắc chắn xóa không?", () => {
      if (this.arrPRG_MO_MT != null) {
        for (let i in this.arrPRG_MO_MT) {
          if (i == index) {
            this.arrPRG_MO_MT.splice(index, 1);
          }
        }
      }
    });
  }
  //#endregion

  //#region tạo PRG OPTION
  addNewPRG_OPTION(detail) {
    let type = this.selectedProgramType.length > 0 ? this.selectedProgramType[0].id : "";
    if (type == "VOTE") {
      let anser = detail.ANSER;
      let ansertitle = detail.ANSER_TITLE;
      if (anser == "" && ansertitle == "") {
        this.notificationService.displayWarnMessage("Bạn phải nhập nội dung");
        return
      }
      for (let i in this.arrPRG_OPTION) {
        let obj: any = this.arrPRG_OPTION[i]
        if (detail.ANSER == obj.ANSER) {
          this.notificationService.displayWarnMessage("Nội dung ANSER không trùng nhau");
          return;
        }
      }
      this.arrPRG_OPTION.push({ ANSER: anser, ANSER_TITLE: ansertitle });
      this.optionAnser = ""
      this.optionAnserTitle = ""
    }
  }

  deletePRG_OPTION(index) {
    this.notificationService.displayConfirmDialog("Bạn có chắc chắn xóa không?", () => {
      if (this.arrPRG_OPTION != null) {
        for (let i in this.arrPRG_OPTION) {
          if (i == index) {
            this.arrPRG_OPTION.splice(index, 1);
          }
        }
      }
    });
  }
  //#endregion

  //#region edit auto MT-MO
  addNewPRG_MO_MTedit(form) {
    let mo = form.autoMO;
    let mt = form.autoMT;
    if (mo == "" && mt == "") {
      this.notificationService.displayWarnMessage("Bạn phải nhập nội dung tin nhắn MO và MT");
      return
    }
    for (let i in this.arrPRG_MO_MTedit) {
      let obj: any = this.arrPRG_MO_MTedit[i]
      if (form.MO == obj.MO) {
        this.notificationService.displayWarnMessage("Tin nhắn MO này đã tồn tại");
        return;
      }
    }
    this.arrPRG_MO_MTedit.push({ MO: mo, MT: mt });
  }

  async deletePRG_MO_MTedit(index) {
    this.notificationService.displayConfirmDialog("Bạn có chắc chắn muốn xóa không?", async () => {
      if (this.arrPRG_MO_MTedit != null) {
        for (let i in this.arrPRG_MO_MTedit) {
          if (i == index) {
            this.arrPRG_MO_MTedit.splice(index, 1);
          }
        }
      }
    });
  }
  //#endregion

  //#region edit option Vote
  addNewPRG_OPTIONedit(form) {
    let type = this.selectedProgramType.length > 0 ? this.selectedProgramType[0].id : "";
    if (type == "VOTE") {
      let anser = form.optionAnser;
      let ansertitle = form.optionAnserTitle;
      if (anser == "" && ansertitle == "") {
        this.notificationService.displayWarnMessage("Bạn phải nhập Mã và nội dung bình chọn");
        return
      }
      for (let i in this.arrPRG_OPTIONedit) {
        let obj: any = this.arrPRG_OPTIONedit[i]
        if (form.ANSER == obj.ANSER) {
          this.notificationService.displayWarnMessage("Mã bình chọn này đã tồn tại");
          return;
        }
      }
      this.arrPRG_OPTIONedit.push({ ANSER: anser, ANSER_TITLE: ansertitle });
    }
  }

  async deletePRG_OPTIONedit(index) {
    this.notificationService.displayConfirmDialog("Bạn có chắc chắn muốn xóa không?", async () => {
      if (this.arrPRG_OPTIONedit != null) {
        for (let i in this.arrPRG_OPTIONedit) {
          if (i == index) {
            this.arrPRG_OPTIONedit.splice(index, 1);
          }
        }
      }
    });
  }
  //#endregion
}
