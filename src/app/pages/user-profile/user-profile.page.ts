import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { LogsService } from 'src/app/services/logs.service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
declare var $:any;
declare var Timeline:any
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.page.html',
	styleUrls: ['./user-profile.page.scss']
})

export class UserProfilePage implements OnInit {
	myForm:FormGroup;
	userInfo:any;
	password:any;
	edit:any = [];
	userId:any;
	show:boolean = false;

	allData:any = [];
	totalHoursToWork :any;
	totalHoursWorked :any;
	fiveDaysLogs: any = [];
	logs : any = [];
	search = false;
	absentEmp:any;
	totalEmployees:any;
	todaysAttendance:any;
	data:any;
	chart:any;
	arrayTotalLogs:any = [];
	demo:any;
	dataLogsDis:any = [];
	allYear:any;
	diffrenceOfdata:any;
	allyearOfdata:any = [];
	dataOb:any;
	yearData:any;
	
	allDataLogs = [];

	constructor(
		public _router: Router,
		public _route: ActivatedRoute,
		public _fb: FormBuilder,
		public _loginService: LoginService,
		private http: HttpClient,
		private _logService: LogsService,
		) {

		this.userInfo = JSON.parse(localStorage.getItem('currentUser'));
		this.userId = this._route.snapshot.paramMap.get('id');
		console.log("the edit component data is:", this.userInfo);
		this.myForm = new FormGroup({
			userRole: new FormControl('', [Validators.required]),
			branch: new FormControl(null),
			designation: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			name: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {

		this.getEmpData();

		var self = this;

		$(document).ready(() => {

			$(function() {

				var start = moment().startOf('month');
				var end = moment().endOf('month');

				function cb(start, end) {
					if(self.userInfo.userRole != 'admin')
						self.getRangeDate(start, end);
				}

				$('#reportrange').daterangepicker({
					startDate: start,
					endDate: end,
					ranges: {
						'Today': [moment(), moment()],
						'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
						'Last 7 Days': [moment().subtract(6, 'days'), moment()],
						'Last 30 Days': [moment().subtract(29, 'days'), moment()],
						'This Month': [moment().startOf('month'), moment().endOf('month')],
						'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
					}
				}, cb);

				cb(start, end);

			});


		});

		this.password = 'password';


	}

	getEmpData(){
		this._logService.getUserById(this.userId).subscribe((res:any) => {
			this.edit = res;	
			console.log("the allDat of user response is =====>", res);
		},(err) => {
			console.log("the allData of user err is ===>", err);
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

	editProfile(){
		this._router.navigate(['edit-profile', this.userId]);
	}

	logout() {
		console.log("logiut ccalled");
		this._loginService.logout();
		this._router.navigate(['login']);
	}
	

	getRangeDate(start, end){
		console.log("RANGE FUNCTION CALLED");
		console.log(" date " ,new Date(start._d).toISOString() , new Date(end._d).toISOString());
		var increseStartDate:any = moment(start._d).add(1 , 'days');
		var body = {
			userId : JSON.parse(localStorage.getItem("currentUser"))._id,
			startDate : new Date(increseStartDate).toISOString(),
			endDate : new Date(end._d).toISOString()
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
				// this.logs = this.properFormatDate(res.foundLogs);
				this.totalHoursToWork = res.TotalHoursToComplete;
				this.totalHoursWorked = res.TotalHoursCompleted;
				console.log("total hours attednent ====>" , this.totalHoursToWork);
				console.log("total hours to attendnace====>" , this.totalHoursWorked);
			}else{
				this.logs = res;
				this.totalHoursToWork = "No Log Found";
				// this.totalHoursToEmp = "No Log Found";
				console.log("the logs is res equal is :====>",this.logs);
			}
			// var self = this;
			// $(document).ready((obj) => {
			// 	if(<HTMLInputElement>document.getElementById('timeline')) {
			// 		console.log("the data of demo user is ====>", this.logs);
			// 		let timeline = new Timeline('timeline', this.arrayTotalLogs);
			// 		console.log("time line =====>", timeline);
			// 		timeline.init();
			// 		console.log("the timeline data is ====>", timeline.data);
			// 	}
			// })
		} , (err)=>{
			console.log("err of getLogsReportById" , err);
		});
	}

	checkData(){
		console.log("hello");
	}

}
