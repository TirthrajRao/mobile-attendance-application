import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { Platform, NavController, LoadingController, ToastController } from '@ionic/angular';
import { LogsService } from 'src/app/services/logs.service';
import { LoginService } from 'src/app/services/login.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

declare var $;

@Component({
	selector: 'app-logs-summary',
	templateUrl: './logs-summary.page.html',
	styleUrls: ['./logs-summary.page.scss'],
})
export class LogsSummaryPage implements OnInit {
	searchData : any;
	userInfo : any;
	currentMonthLogs  ;
	currentMonthLogsCount = [] ;
	modelValue : any ;
	p: number = 1;

	data = {
		firstDate : "",
		secondDate : "",
		name: ""
	};
	previousData : any;
	logs : any;
	flag = false;
	search:any;
	totalHoursToWork:any;
	totalHoursWorked:any;
	totalHoursToEmp:any;

	allEmployeesLogs : any = [];
	absentEmp:any = [];
	totalEmployees:any;
	minDate:any;
	maxDate:any;

	constructor(public _logService: LogsService , private route: ActivatedRoute,
		private router: Router , public _loginService: LoginService , private http: HttpClient,public _toast: ToastController
		) { }
	
	ngOnInit() {
		this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
		var branchName = localStorage.getItem('branchSelected');
		$(document).ready(() => {
			var self = this;

			if(branchName == 'rajkot'){

				$("#rajkot").addClass( "active");
				$("#ahemdabad").removeClass("active");
			}else{
				console.log("hey");
				$("#ahemdabad").addClass("active");
				$("#rajkot").removeClass("active");
			}

			$(function() {

				var start = moment().startOf('month');
				console.log("the moment of date is ======>", start);
				var end = moment().endOf('month');
				console.log("the moment of end is =======>", end);
				function cb(start, end) {
					console.log("the start is +++++++++++++++++++++++>", start);
					if(self.userInfo.userRole != 'admin')
						self.getRangeDate(start, end);
				}

				var element = <HTMLInputElement> document.getElementById("example2");
				element.disabled = true;

				$('#example1').datepicker({
					todayHighlight: true,
					autoclose: true,
					format: "mm/dd/yyyy",
					clearBtn : true,
				}).on('show', function(e){
					var date = $('#example2').datepicker('getDate');
					if(date){
						$('#example1').datepicker('setEndDate', date);
					}
				}).on('changeDate', function(selected){
					$('#example1').val();
					self.minDate = selected.date;
					var element = <HTMLInputElement> document.getElementById("example2");
					$('#enddate').datepicker('setStartDate', this.minDate)
					if($('#example1').val()) {
						element.disabled = false;
					}
					else {
						element.disabled = true;	
					}
				});

				$('#example2').datepicker({
					todayHighlight: true,
					autoclose: true,
					format: "mm/dd/yyyy",
					clearBtn : true,
				}).on('show', function(e){
					var date = $('#example1').datepicker('getDate');
					if(date){
						$('#example2').datepicker('setStartDate', date);
					}
				}).on('changeDate', function(selected) {
					self.maxDate = selected.date;
					$('#startdate').datepicker('setEndDate', this.maxDate);
					if(self.userInfo.userRole != 'admin')
						self.getRangeDate(start, end);	
				});
				cb(start, end);
			})
		});
		if(this.userInfo.userRole == 'admin'){
			this.search = false;
		}
	}

	getLogsCountByMonthDefault(){
		this._logService.getLogsCountByMonthDefault().subscribe((response: any) => {
			console.log("responde ---->" , response);
			let count = 1;
			while(response['length'] >= 1){
				response['length'] = response['length'] / 5;
				this.currentMonthLogsCount.push(count);
				count++;
			}
			if(count != 2)
				this.currentMonthLogsCount.push(count)
			console.log("this.currentMonthLogsCount " , this.currentMonthLogsCount);
		}, (err) => {
			console.log("err of getLogsByMonthDefault ==>" , err);
		});
	}

	getRangeDate(start, end){
		console.log("RANGE FUNCTION CALLED");
		if(this.minDate === undefined) {
			var increseStartDate:any = moment(start._d).add(1 , 'days');
			var body = {
				userId : JSON.parse(localStorage.getItem("currentUser"))._id,
				startDate : new Date(increseStartDate).toISOString(),
				endDate : new Date(end._d).toISOString()
			}	
		}
		else {
			var increseStartDate:any = moment(this.minDate).add(1 , 'days');
			var adddate:any = moment(this.maxDate).add(1, 'days');
			console.log("the increseStartDate is the ================>"), increseStartDate;

			var body = {
				userId : JSON.parse(localStorage.getItem("currentUser"))._id,
				startDate : new Date(increseStartDate).toISOString(),
				endDate : new Date(adddate).toISOString()
			}
		}
		this.search = true;
		this._logService.getLogsReportById(body).subscribe((res:any)=>{
			console.log("response of getLogsReportById" , res);
			if(res.foundLogs){ 
				this.logs = res.foundLogs;
				this.logs.forEach((objData)=>{
					if(objData.diffrence == null){
						objData['seconds'] = 'AB';
					}
					else if(objData.diffrence == '-'){
						objData['seconds'] = 'N/A';	
					}
					else if(objData.diffrence != '-' || objData.diffrence != null){
						objData['seconds'] = moment.duration(objData.diffrence).asSeconds();
					}
				});
				this.totalHoursToWork = res.TotalHoursToComplete;
				this.totalHoursWorked = res.TotalHoursCompleted;
				console.log("total hours attednent ====>" , this.totalHoursToWork);
				console.log("total hours to attendnace====>" , this.totalHoursWorked);
			}else{
				this.logs = res;
				this.totalHoursToWork = "No Log Found";
				this.totalHoursToEmp = "No Log Found";
				console.log("the logs is res equal is :====>",this.logs);
			}

		} , (err)=>{
			console.log("err of getLogsReportById" , err);
		});
	}

	calculateTotalDuration(array , resultHours, start , end){
		var workingHours = 0;
		var totalHours = 0;
		console.log("result hours =========>" , resultHours);
		if(resultHours < 1)
			resultHours = 1	
		for(var i = 0 ; i< Math.ceil(resultHours) ; i++){
			console.log(resultHours - i);
			var local:any = moment(start._d).subtract(i, 'days');
			local =  moment(local._d , "YYYY-MM-DD HH:mm:ss").format('dddd');
			if(local.toString() != "Sunday")
				totalHours = totalHours + 30600; 
		}
		array.forEach((obj)=>{
			if(obj.diffrence){
				workingHours = workingHours + moment.duration(obj.diffrence).asSeconds();
				console.log("workingHours ====>" , workingHours);
			}
		});

		var minutes = Math.floor(totalHours / 60);
		totalHours = totalHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		console.log("totalHours ====>" , hours , minutes);
		this.totalHoursToWork =  hours+":"+minutes+":"+"00";

		var minutes = Math.floor(workingHours / 60);
		workingHours = workingHours%60;
		var hours = Math.floor(minutes/60)
		minutes = minutes%60;
		this.totalHoursWorked = hours+":"+minutes+":"+"00";
		console.log("total hours attednent ====>" , this.totalHoursToWork);
		console.log("total hours to attendnace====>" , this.totalHoursWorked);

	}

	branchSelector(branchName){
		console.log(branchName);
		localStorage.setItem('branchSelected' , branchName);
		this.currentMonthLogs  = null;
		this.ngOnInit();
	}

	getBackGroundColorSingleEmployee(value){
		console.log("value of color" , value);
		if(typeof value != 'string'){
			if(value < 30600){
				return  '#ff686810'
			}else{
				return  '#00800010'
			}
		}else{
			if(value == 'Sunday'){
				return  '#8c8cf366'
			}else{
				return  'silver'
			}
		}
	}
	getColorSingleEmployee(value){
		console.log("VALUE +++++++++++++>", value);
		if(typeof value != 'string'){
			if(value < 30600){
				return  'red'
			}else{
				return  'green'
			}
		}else{
			if(value == 'Sunday'){
				return  'blue'
			}else{
				return  'black'
			}
		}
	}
}