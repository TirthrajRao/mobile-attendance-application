import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.page.html',
	styleUrls: ['./edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {
	editForm:FormGroup;
	passForm:FormGroup;
	edit:any = [];
	userInfo:any;
	show:boolean = false;
	password:any;
	userId:any;
	message:any;

	constructor(public _logsService: LogsService, public _router: Router, public _route: ActivatedRoute, public _fb: FormBuilder,
		public _loginService: LoginService, private http: HttpClient, public menuctl: MenuController
		) { 
		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.editForm = new FormGroup({
			userRole: new FormControl('', [Validators.required]),
			branch: new FormControl(null),
			designation: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			name: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
		this.passForm = new FormGroup({
			oldPassword: new FormControl('', [Validators.required]),
			newPassword: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {
		this.getEmpData();
		this.password = 'password';
	}

	getEmpData(){
		this._logsService.getUserById(this.userInfo._id).subscribe((res:any) => {
			this.edit = res;	
			console.log("the user response is =====>", res);
		},(err) => {
			console.log("the user err is ===>", err);
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

	updateUser(){
		this._logsService.getEditById(this.userInfo._id, this.edit).subscribe((res:any) => {
			console.log("the getEditById data is: =====>", res);
			localStorage.setItem("currentUser", JSON.stringify(res));
			this._router.navigate(['user-profile']);
			this._logsService.sendMessage(res);
		}, (err) => {
			console.log("the getEditById of err is: ===>", err);
		});
	}

	updatePass(userInfo){		
		this.userInfo.password = this.passForm.value.confirmPassword;
		this.edit = this.userInfo;
		this.passForm.reset();
	}
}
