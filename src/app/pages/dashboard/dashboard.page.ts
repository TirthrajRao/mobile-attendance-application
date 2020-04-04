import { Component, OnInit, Output , Input , ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogsService } from 'src/app/services/logs.service';
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

	loginFlag

	constructor(
		private _logService: LogsService,
		private _router: Router
		) { }

	ngOnInit() {
		this.getLastFiveDaysAttendance();
			this.getCurrentDateLogById();
		}
		
	getCurrentDateLogById(){
		this._logService.getCurrentDateLogById().subscribe((response:any) => {
			console.log("response of getCurrentDateLogById ===>" , response);
			if(response.length){
				this.filledAttendanceLog = this.properFormatDate(response);
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

			}	
		}, (err)=>{
			console.log("error of getCurrentDateLogById ===>" , err);
		});
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
}
