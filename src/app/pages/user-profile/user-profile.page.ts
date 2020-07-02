import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LogsService } from 'src/app/services/logs.service';
import { LoginService } from 'src/app/services/login.service';
import { ViewChildren, QueryList } from '@angular/core';
import { Platform, IonRouterOutlet, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})

export class UserProfilePage implements OnInit {
  userInfo:any;
  password:any;
  edit:any = [];
  userId:any;
  show:boolean = false;
  allData:any = [];
  skeleton:any;
  name: any;
  designation: any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  subscribe:any;
  allUser:any = {
    "branch": "",
    "designation": "",
    "email": "",
    "name": "",
    "password": "",
    "userRole": "",
  }

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    public _router: Router,
    public _route: ActivatedRoute,
    public _loginService: LoginService,
    private _logService: LogsService,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController
    ) {

    this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() => {
      if (this.constructor.name == "UserProfilePage") {
        if (window.confirm("do you want to exit app")) {
          navigator["app"].exitApp();
        }
      }
    })

    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.edit = this.userInfo;
    this.userId = this.userInfo._id;

    this.backButtonEvent();
  }

  ngOnInit() {
    this.getEmpData();
    this.ionViewDidEnter();

    this._logService.usermessage$.subscribe( message => {
      this.edit = message;
      this.allData[0] = this.edit;
      this.name = this.edit.name;
      this.designation = this.edit.designation;
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
      }
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this._router.url === 'UserProfilePage') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); 
          }
        }
      });
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.skeleton = {
        'heading': 'Normal text',
        'para1': 'Lorem ipsum dolor sit amet, consectetur',
        'para2': 'adipiscing elit.'
      };
    }, 4000);
  }

  getEmpData(){
    this._logService.getUserById(this.userId).subscribe((res:any) => {
      console.log("the getUserById of response is =====>", res);
      this.allData[0] = res;  
      this.name = res.name;
      this.designation = res.designation;
    },(err) => {
      console.log("the getUserById of err is ===>", err);
    });
  }

  viewPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  editProfile(){
    this._router.navigate(['edit-profile']);
  }
}