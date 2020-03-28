import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginForm:FormGroup;
	email:string;
	password:string;

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		public _router: Router,
		) { 
		this.loginForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-8._%+-]+@[a-z0-9.-]+\.[a-z]{1,3}$')]),
			password: new FormControl('', [Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')])
		});

		this.initializeApp();
	}

	ngOnInit() {
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	login(value){
		console.log("the value is ====>", value);
		this._router.navigate(['folder']);
	}
}
