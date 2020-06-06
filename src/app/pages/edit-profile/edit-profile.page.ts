import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/services/logs.service';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
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

	constructor(public _logsService: LogsService, public _router: Router, public _route: ActivatedRoute, public _fb: FormBuilder,
		public _loginService: LoginService, private http: HttpClient
		) { 
		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.userId = this._route.snapshot.paramMap.get('id');
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
		this._logsService.getUserById(this.userId).subscribe((res:any) => {
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
		var Id = this.userId
		console.log("the all Edit data is ======>", this.edit);
		this._logsService.getEditById(this.userId, this.edit).subscribe((res:any) => {
			console.log("the edit data is: =====>", res);
					this._router.navigate(['user-profile', Id])
				    this._logsService.sendMessage(res);
		}, (err) => {
			console.log("the edit data err is: ===>", err);
		});
	}

	updatePass(userInfo){		
		this.userInfo.password = this.passForm.value.confirmPassword;
		console.log("the edit data is: =====>", this.userInfo.password);
		this.edit = this.userInfo;
		this.passForm.reset();
	}

	logout() {
		console.log("logiut called");
		this._loginService.logout();
		this._router.navigate(['login']);
	}
}
