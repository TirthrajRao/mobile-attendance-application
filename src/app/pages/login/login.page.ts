import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Platform, LoadingController, NavController } from '@ionic/angular';
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
	email:string;
	password:string;
	isError : boolean = false;
	isDisable:boolean =false;
	errorMessage : any;
	loginFlag: boolean = false;
	subscription: Subscription;

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		public _router: Router,
		public _loginService: LoginService,
		private _loadingController: LoadingController,
		public _navCtrl: NavController
		) { 
		if(localStorage.getItem('currentUser')) {
			localStorage.removeItem('currentUser');
		}

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
		this.ionViewDidEnter();
		this.ionViewWillLeave();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

private loading;

	login(value){
		console.log("the loginForm value is ===>", this.loginForm.value);
		this._loginService.loginUser(value).subscribe((response) => {
			console.log("successfull login"  , response);
			this.isDisable = false;
			this.isError = false;
			localStorage.setItem('currentUser', JSON.stringify(response));
				this._loadingController.create({
					message: ''
				}).then((overlay) => {
					this.loading = overlay;
					this.loading.present();
				});

				setTimeout(() => {
					this._loadingController.dismiss();
					this._navCtrl.navigateRoot('');
				}, 3000)
			// this._router.navigate(['']);
			this.loginForm.reset();
		},(err) => {
			console.log(err.status)
			if(err.status == 400){
				this.errorMessage = "Check your Email/Password and try again";
			}else if(err.status == 404){
				this.errorMessage = "Please check out the connection and try again";
			}else if(err.status == 500){
				this.errorMessage = "We are sorry for it , try again after sometime";
			}
			this.isError = true;
			console.log("err in login " , err);
		})
		console.log(value);
	}	

	ionViewDidEnter(){
		this.subscription = this.platform.backButton.subscribe(()=>{
			navigator['app'].exitApp();
		});
	}

	ionViewWillLeave(){
		this.subscription.unsubscribe();
	}
}
