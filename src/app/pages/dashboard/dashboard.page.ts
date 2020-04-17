import { Component, OnInit, Output , Input , ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, NavController} from '@ionic/angular';
import { LogsService } from 'src/app/services/logs.service';
import { interval, Subscription } from 'rxjs';

import * as moment from 'moment';
declare var $;

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
	intervalId: number;
	loginFlag
	dates : any = [];
	alldate = {
		dates: ""
	}

	constructor(
		private _logService: LogsService,
		private _router: Router,
		private platform: Platform
		) { 
	}

	ngOnInit() {
		this.getLastFiveDaysAttendance();

		// const source = interval(10000);
		// this.subscription = source.subscribe(val => this.opensnack());
		this.ionViewDidEnter();
		this.ionViewWillLeave();
		this.opensnack();
	}

	opensnack() {
		setInterval(() => {
			// alert("Hello"); 
		this._logService.getCurrent().subscribe((res:any) => {
			console.log("res is ngOninit", res);
		}, (err) => {
			console.log("the error ===>", err.status);
			if (err.status == 200) {
				var time = new Date();
				var hrs = time.getHours();
				var min = time.getMinutes();
				var sec = time.getSeconds();

				if (hrs > 12) {
					hrs = hrs - 12;
				}

				if (hrs == 0) {
					hrs = 12;
				}
				this.alldate.dates = document.getElementById('clock').innerHTML = hrs + ':' + min + ':' + sec;			
				console.log("the alldate", this.alldate);
				localStorage.setItem('date', JSON.stringify(this.alldate))
				var getdate = JSON.parse(localStorage.getItem('date'));
				console.log("the date is ===>", getdate);
				this.dates.push(getdate);
				console.log("the dates is ===>", this.dates);
			}
		})		
		}, 60000);
	}

	ngOnDestroy() {
		this.subscription && this.subscription.unsubscribe();

		clearInterval(this.intervalId);
	}


	fillAttendance(){
		this._logService.fillAttendance().subscribe((response:any) =>{
			console.log("response ====>" , response);

			this.filledAttendanceLog = this.properFormatDate(response);
			this.filledAttendanceLog=this.filledAttendanceLog.reverse();  
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
			if(lastRecord != '-'){
				this.exit = this.filledAttendanceLog[0].timeLog[timeLogLength].out; 
				this.entry = false;
			}else{
				this.entry = this.filledAttendanceLog[0].timeLog[timeLogLength].in; 
				this.exit = false;
			}
		} , (err) =>{
			console.log("err ===>" , err);
		});
	}

	getLastFiveDaysAttendance(){
		var id = 0;
		this._logService.getLastFiveDaysAttendance(id).subscribe((response:any) => {
			console.log("last five days response" , response);
			if(response.message != 'No logs found'){
				this.fiveDaysLogs = this.properFormatDate(response.foundLogs);
				this.fiveDaysLogs = this.fiveDaysLogs.reverse();  
			}
		} ,(err) => {
			console.log("last five days error" , err);
		});
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
