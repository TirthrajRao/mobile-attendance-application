import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LogsService } from 'src/app/services/logs.service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    public _router: Router,
    public _route: ActivatedRoute,
    public _fb: FormBuilder,
    public _loginService: LoginService,
    private http: HttpClient,
    private _logService: LogsService,
    ) {
    this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = this._route.snapshot.paramMap.get('id');
    this.myForm = new FormGroup({
      userRole: new FormControl('', [Validators.required]),
      branch: new FormControl(null),
      designation: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.getEmpData();
    this.password = 'password';
    
    this._logService.usermessage$
    .subscribe(
      message => {
        this.edit = message;
      }
    )
  }

  getEmpData(){
    this._logService.getUserById(this.userId).subscribe((res:any) => {
      this.edit = res;  
      console.log("the user of response is =====>", res);
    },(err) => {
      console.log("the user of err is ===>", err);
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
    this._router.navigate(['edit-profile', this.userId]);
  }

  logout() {
    this._loginService.logout();
    this._router.navigate(['login']);
  }
}