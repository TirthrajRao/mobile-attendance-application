import { Component, OnInit, Output , Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, NavController, LoadingController, ToastController, MenuController } from '@ionic/angular';
import { LogsService } from 'src/app/services/logs.service';
import { interval, Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { AlertController } from '@ionic/angular';
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
		date: "",
		day: "",
		lastLog: ""
	};
	todaysAttendance : any
	timeflag
	data:any;
	subscribe:any;
	private loading;

	constructor(private _logService: LogsService, private _router: Router, private platform: Platform, public _loginService: LoginService,
		private _loadingController: LoadingController, private _navCtrl: NavController, public _toast: ToastController,
		public alertController: AlertController, public menuctl: MenuController
		) {
		
		this.checkIp();
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		if(!this.userInfo){
			this._router.navigate(['/login']);
		}


		this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() => {
			if (this.constructor.name == "DashboardPage") {
				if (window.confirm("do you want to exit app")) {
					navigator["app"].exitApp();
				}
			}
		})

		if(this.userInfo.userRole != 'admin'){
			this.getCurrentDateLogById();
			this.getLastFiveDaysAttendance();
		}
	}

	ngOnInit() {
		this.ionViewDidEnter();
		this.ionViewWillLeave();
	}

	ionViewWillEnter() {
		setTimeout(() => {
			this.data = {
				'heading': 'Normal text',
				'para1': 'Lorem ipsum dolor sit amet, consectetur',
				'para2': 'adipiscing elit.'
			};
		}, 4000);
	}

	getCurrentDateLogById(){
		this._logService.getCurrentDateLogById().subscribe((response:any) => {
			console.log("response of getCurrentDateLogById ===>" , response);

			if(response.length){
				this.filledAttendanceLog = this.properFormatDate(response);
				console.log("the filledAttendanceLog is =======>", this.filledAttendanceLog);

				var timeLogLength = this.filledAttendanceLog[0].timeLog.length - 1;
				console.log(timeLogLength);
				var lastRecord = this.filledAttendanceLog[0].timeLog[timeLogLength].out;
				if(lastRecord != '-'){
					this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
					this.entry = false;
					this.closedata();
				}else{
					this.dateStore();
					if (this.timeString < this.milseconds) {
						this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in; 
						this.exit = false;
						this.MarkAttendance();
					}
					else {
						this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in; 
						this.exit = false;	
					}
					this.opensnack();
				}
			}	
		}, (err)=>{
			console.log("error of getCurrentDateLogById ===>" , err);
		});
	}

	dateStore(){
		var dateObj = new Date(60 * 1000); 
		var hours = dateObj.getUTCHours(); 
		var minutes = dateObj.getUTCMinutes(); 
		var seconds = dateObj.getSeconds(); 
		this.timeString = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') 
		+ ':' + seconds.toString().padStart(2, '0'); 

		if (localStorage.getItem('olddate')) {
			this.olddateCom = JSON.parse(localStorage.getItem('olddate'));

			var datesCurrent = moment().format("LTS");
			var start = moment.utc(this.olddateCom.lastLog, "hh:mm:ss");
			var end = moment.utc(datesCurrent, "hh:mm:ss");
			var dateDiffrence = moment.duration(end.diff(start));
			this.secondsdata.push(dateDiffrence);
			this.milseconds = moment("1900-01-01 00:00:00").add(this.secondsdata[0]._milliseconds/1000, 'seconds').format("HH:mm:ss")
		}
	}

	checkIp(){
		console.log("hye in check");
		this._loginService.getIpCliente().subscribe((response)=>{
		},(err)=>{
			console.log("this --------------> ",err);
			if(err.error.text == '119.160.195.171' || err.error.text == '1.38.72.84' || err.error.text == '114.31.184.117' || err.error.text == '27.57.190.69' || err.error.text == '27.54.180.182' || err.error.text == '122.170.44.56' || err.error.text == '110.227.229.183'){
				this.loginFlag = true;
				this.userInfo['loginFlag'] = true;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
			}
			else{	
				this.loginFlag = false;
				this.userInfo['loginFlag'] = false;
				localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
			}
		});
	}

	fillAttendance(){
		if(JSON.parse(localStorage.getItem('currentUser')).loginFlag == false){
			Swal.fire({
				title: 'Are you sure?',
				text: "Mark attendance from unauthorized IP address",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, Mark Attendance!'
			}).then((result) => {
				if (result.value) {
					this.MarkAttendance();
				}
			});
		}
		else{
			this.MarkAttendance();
		}
	}

	MarkAttendance(){
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
				if (this.timeflag == true) {
					this.exit = this.olddateCom.lastLog; 
					this.entry = false;
					this.closedata();
				}
				else {
					this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
					this.entry = false;
					this.closedata();
				}
			}
			else {
				this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in;
				this.exit = false;
				this.opensnack();
			}
		} , (err) =>{
			console.log("err ===>" , err);
		});
	}

	openModel(index){
		console.log("hey" , index);
		if(!this.userInfo.userRole || this.userInfo.userRole == 'employee')
			this.modelValue = this.fiveDaysLogs[index];
		else{
			this.modelValue = this.todaysAttendance[index];
		}
		$('#myModal').modal('show');
	}

	getLastFiveDaysAttendance(){
		var id = 0;
		this._logService.getLastFiveDaysAttendance(id).subscribe((response:any) => {
			console.log("the last five day logs is ===>" , response);
			if(response.message != 'No logs found'){
				this.fiveDaysLogs = this.properFormatDate(response.foundLogs);
				this.fiveDaysLogs = this.fiveDaysLogs.reverse();  
			}
		} ,(err) => {
			console.log("last five days error" , err);
		});
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
					this.alldate.date = moment(). format('DD/MM/YYYY');
					this.alldate.day = moment().format('dddd'); 
					this.alldate.lastLog = moment().format("h:mm:ss a");
					console.log("the alldate", this.alldate);
					localStorage.setItem('olddate', JSON.stringify(this.alldate));

					// localStorage.setItem('date', JSON.stringify(this.alldate))
					this.getdate = JSON.parse(localStorage.getItem('olddate'));
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

	ionViewDidEnter(){
		this.subscription = this.platform.backButton.subscribe(()=>{
			navigator['app'].exitApp();
		});
	}

	ionViewWillLeave(){
		this.subscription.unsubscribe();
	}
}