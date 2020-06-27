import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LogsService } from 'src/app/services/logs.service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { Platform, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { EditProfilePage } from 'src/app/pages/edit-profile/edit-profile.page';
import * as moment from 'moment';
declare var $:any;
declare var Timeline:any
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})

export class UserProfilePage implements OnInit {
  myForm:FormGroup;
  userInfo:any;
  password:any;
  edit:any = [];
  userId:any;
  show:boolean = false;
  allData:any = [];
  data:any;
  skeleton:any;
  name: any;
  designation: any;
  allUser:any = {
    "branch": "",
    "designation": "",
    "email": "",
    "name": "",
    "password": "",
    "userRole": "",
  }

  constructor(
    public _router: Router,
    public _route: ActivatedRoute,
    public _fb: FormBuilder,
    public _loginService: LoginService,
    private http: HttpClient,
    private _logService: LogsService,
    private _loadingController: LoadingController,
    public menuctl: MenuController,
    ) {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.edit = this.userInfo;
    this.userId = this.userInfo._id;
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