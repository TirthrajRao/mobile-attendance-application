import { Component, OnInit, Output , Input , ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, NavController, LoadingController, ToastController } from '@ionic/angular';
import { LogsService } from 'src/app/services/logs.service';
import { interval, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import * as moment from 'moment';
declare var $;
declare var require: any;
const momentDurationFormat = require('moment-duration-format');

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
	modelValue : any;
	attendanceFlag: any ; 
	userInfo ;
	filledAttendanceLog ;
	entry : any;
	exit : any ;
	fiveDaysLogs : any = [];
	subscription: Subscription;
	intervalId: any;
	loginFlag
	dates : any = [];
	getdate:any;
	olddate:any;
	olddateCom:any;
	timeOf:any;
	timeOn:any;
	diffTime:any;
	milseconds:any;
	secondsdata:any = [];
	timeString:any;
	alldate = {
		dates: ""
	}
	subscribe:any;
	private loading;

	constructor(
		private _logService: LogsService,
		private _router: Router,
		private platform: Platform,
		public _loginService: LoginService,
		private _loadingController: LoadingController,
		private _navCtrl: NavController,
		public _toast: ToastController
		) { 
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		if(!this.userInfo){
			this._router.navigate(['/login']);
		}

		this.dateStore();

		if(this.userInfo.userRole != 'admin'){
			this.getCurrentDateLogById();
		}

		this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() => {
			if (this.constructor.name == "DashboardPage") {
				if (window.confirm("do you want to exit app")) {
					navigator["app"].exitApp();
				}
			}
		})

	}

	ngOnInit() {
		this.ionViewDidEnter();
		this.ionViewWillLeave();
		this.checkIp();

	}

	getCurrentDateLogById(){
		this._logService.getCurrentDateLogById().subscribe((response:any) => {
			console.log("response of getCurrentDateLogById ===>" , response);

			if(response.length){
				this.filledAttendanceLog = this.properFormatDate(response);
				console.log("the filledAttendanceLog is =======>", this.filledAttendanceLog);
				// this.filledAttendanceLog = response;

				var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
				console.log(timeLogLength);
				var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
				if(lastRecord != '-'){
					console.log("the exit is called");
						this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
						console.log("the exit of function is ====>", this.exit);
						this.entry = false;
				}else{
					this.entry = this.olddateCom.dates; 
					this.exit = false;
					console.log("the oldseconds and current seconds diffrence is ====>", this.milseconds);
					if (localStorage.getItem('olddate')) {
						if (this.timeString > this.milseconds) {
							console.log("the difftime is true");
						}
						else {
							this.exit = this.olddateCom.dates; 
						console.log("the exit of function is ====>", this.exit);
						this.entry = false;
							this.closedata();	
							this.fillAttendance();
							console.log("the diffTime is false");
						}
					}
					this.opensnack();
				}
			}	
		}, (err)=>{
			console.log("error of getCurrentDateLogById ===>" , err);
		});
	}
	demo:any;
	dateStore(){
		var dateObj = new Date(60 * 1000); 
		var hours = dateObj.getUTCHours(); 
		var minutes = dateObj.getUTCMinutes(); 
		var seconds = dateObj.getSeconds(); 

		this.timeString = hours.toString().padStart(2, '0') + 
		":" + minutes.toString().padStart(2, '0') 
		+ ':' + seconds.toString().padStart(2, '0'); 

		console.log("the time string is =======>", this.timeString);
		
		if (localStorage.getItem('olddate')) {
			this.olddateCom = JSON.parse(localStorage.getItem('olddate'));
			console.log("the olddateCom is ======>", this.olddateCom);

			var datesCurrent = moment().format("LTS");
			console.log("the dates demo is ====>", datesCurrent);
			var start = moment.utc(this.olddateCom.dates, "hh:mm:ss");
			var end = moment.utc(datesCurrent, "hh:mm:ss");
			var dateDiffrence = moment.duration(end.diff(start));
			console.log("the date dateDiffrence is the ==============>", dateDiffrence);
			this.secondsdata.push(dateDiffrence);
			this.milseconds = moment("1900-01-01 00:00:00").add(this.secondsdata[0]._milliseconds/1000, 'seconds').format("HH:mm:ss")
			console.log("the oldsecond and current seconds diffrence is ===>", this.milseconds);
		}
	}



	fillAttendance(){
		this._logService.fillAttendance().subscribe((response:any) =>{
			console.log("response ====>" , response);

			this.filledAttendanceLog = this.properFormatDate(response);
			console.log("the filledAttendanceLog is =======>", this.filledAttendanceLog);

			this.filledAttendanceLog=this.filledAttendanceLog.reverse();  
			console.log("the filledAttendanceLog reverse is =======>", this.filledAttendanceLog);

			var flag = 0;
			if(this.fiveDaysLogs){
				console.log("IN IFFFFFFFFFFFFF =============?");
				this.fiveDaysLogs.filter((data)=>{
					console.log("IN IFFFFFFFFFFFFF =============?" , data.date == this.filledAttendanceLog[0].date);
					if(data.date == this.filledAttendanceLog[0].date){
						console.log(data.date , this.filledAttendanceLog[0].date)
						flag = 1;
					}
				});
				console.log("IN IFFFFFFFFFFFFF =============?", this.fiveDaysLogs);

			}
			if(flag == 0 && this.fiveDaysLogs){
				this.fiveDaysLogs.unshift(this.filledAttendanceLog[0]);
			}else{
				this.fiveDaysLogs[0] = this.filledAttendanceLog[0];
			}
			var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
			console.log(timeLogLength);
			var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
			console.log("the last lastRecord is ====>", lastRecord);
			if(lastRecord != '-'){
				if (this.olddateCom) {
						console.log("the difftime is true");
						this.exit = this.olddateCom.dates; 
						console.log("the exit function true is ====>", this.exit);
						this.entry = false;
						this.closedata();
					}
					else {
						this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
						console.log("the exit of function is ====>", this.exit);
						this.entry = false;
						this.closedata();
						console.log("the diffTime is false");
					}
			}else{
				this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in;
				console.log("the entry function is ===>", this.entry); 
				this.exit = false;
				this.opensnack();
			}
		} , (err) =>{
			console.log("err ===>" , err);
		});
	}

	hmsToSeconds(s) {
		var b = s.split(':');
		return b[0]*3600 + b[1]*60 + (+b[2] || 0);
	}

	secondsToHMS(secs) {
		function z(n){return (n<10?'0':'') + n;}
		var sign = secs < 0? '-':'';
		secs = Math.abs(secs);
		return sign + z(secs/3600 |0) + ':' + z((secs%3600) / 60 |0) + ':' + z(secs%60);
	}

	async opensnack() {
		const toast = await this._toast.create({
			message: 'Fill Attendence Successfully.',
			duration: 2000
		})
		toast.present();
		console.log("the opensnack function is called");
		this.intervalId = setInterval(() => {
			this._logService.getCurrent().subscribe((res:any) => {
				console.log("res is ngOninit", res);
			}, (err) => {
				console.log("the error ===>", err.status);
				if (err.status == 200) {
					this.alldate.dates = moment().format("h:mm:ss a");
					console.log("the alldate", this.alldate);
					localStorage.setItem('olddate', JSON.stringify(this.alldate));

					localStorage.setItem('date', JSON.stringify(this.alldate))
					this.getdate = JSON.parse(localStorage.getItem('date'));
					console.log("the date is ===>", this.getdate);

					this.olddate = this.dates[this.dates.length - 1];
					console.log("the old date is ====>", this.olddate);
					this.dates.push(this.getdate);
					console.log("the dates is ===>", this.dates);   
				}
			})		
		}, 10000);
		console.log("the interval id is ====>", this.intervalId);
	}

	async closedata(){
		const toast = await this._toast.create({
			message: 'Stop Attendence.',
			duration: 2000
		})
		toast.present();
		console.log("the closedata function is called");
		localStorage.removeItem('date');
		localStorage.removeItem('olddate')
		clearInterval(this.intervalId);
	}

	properFormatDate(data){
		return data = data.filter((obj)=>{
			return obj.date = moment(obj.date).utc().format("DD/MM/YYYY");

		});
	}

	checkIp(){
		console.log("hye in check");
		this._loginService.getIpCliente().subscribe((response)=>{
		},(err)=>{
			console.log("this --------------> ",err);
			if(err.error.text == '119.160.195.171' || err.error.text == '27.57.190.69' || err.error.text == '27.54.180.182' || err.error.text == '122.170.44.56' || err.error.text == '110.227.229.183'){
				this.loginFlag = true;
				this.userInfo['loginFlag'] = true;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
				// alert(err.error.text + " --> Valid IP");	
			}
			else{	
				this.loginFlag = false;
				this.userInfo['loginFlag'] = false;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
				// alert(err.error.text + " ---> Invalid IP");
			}
		});
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