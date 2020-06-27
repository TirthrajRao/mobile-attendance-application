import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Platform, LoadingController, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { interval, Subscription } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginForm:FormGroup;
	isError : boolean = false;
	isDisable:boolean =false;
	errorMessage : any;
	loginFlag: boolean = false;
	subscription: Subscription;
	email:any;
	loading:any;
	data:any = {
		"email": "",
		"password": ""
	}
	userInfo:any;
	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		public _router: Router,
		public _loginService: LoginService,
		public _loadingController: LoadingController,
		public _navCtrl: NavController,
		private route: ActivatedRoute,
		private _menuctl: MenuController
		) { 
		if (this._loginService.currentUserValue) { 
			this._router.navigate(['']);
		}

		this.loginForm = new FormGroup({
			email: new FormControl('', Validators.required),
			password:new FormControl('' , Validators.required)
		});

		this.initializeApp();
	}

	ngOnInit() {
		this.ionViewWillEnter();
		this.ionViewDidLeave();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	ionViewWillEnter(){
		this._menuctl.enable(false);	
	}

	ionViewDidLeave(){
		this._menuctl.enable(true);
	}

	get f() { return this.loginForm.controls; }

	login(value){


		var email = this.loginForm.value.email;
		var textLowercase = email.toLowerCase();		
		this.data.email = textLowercase;
		this.data.password = this.loginForm.value.password;
		this._loadingController.create({
			message: "Loading...",
			spinner: 'circular',
			translucent: true,
			showBackdrop: false,
		}).then((loading) => {
			loading.present();

			setTimeout(() => {
				loading.dismiss();
				this._loginService.loginUser(this.data).subscribe((response) => {
					this._router.navigate(['/']);
					console.log("successfull login"  , response);
					this.isDisable = false;
					this.isError = false;
					this.loginForm.reset();
					localStorage.setItem('currentUser', JSON.stringify(response));
				},(err) => {
					console.log(err.status)
					if(err.status == 400){
						this.loginForm.reset();
						this.errorMessage = "Check your Email/Password and try again";
					}else if(err.status == 404){
						this.errorMessage = "Please check out the connection and try again";
					}else if(err.status == 500){
						this.errorMessage = "We are sorry for it , try again after sometime";
					}
					this.isError = true;
					console.log("err in login " , err);
				})
			}, 4000);
			console.log("the loader is called ");
			console.log(value);
		});			
	}	
}



