import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  { config } from '../config'; 
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  currentTime:any;
  lastDate:any;
  body:any;

  constructor(public _http: HttpClient,
    ) { 
    this.lastDate = moment(). format('DD/MM/YYYY');
    console.log("the dates is =======>", this.lastDate);
    if (JSON.parse(localStorage.getItem('olddate'))) {
      this.currentTime = JSON.parse(localStorage.getItem('olddate'));
      console.log("the currentTime time is ========>", this.currentTime);
    console.log("the currentTime id the date is ===>", this.currentTime.date);
    }
  }

  getCurrentDateLogById(){
  	console.log(" Into the service ");
  	var body = {
  		userId : JSON.parse(localStorage.getItem('currentUser'))._id
  	}
    console.log(body);
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-attendance-by-id" , body);	
  }
  
  fillAttendance(){
    if (localStorage.getItem('olddate') == null) {
    this.body = {
      userId : JSON.parse(localStorage.getItem('currentUser'))._id,
      loginFlag : JSON.parse(localStorage.getItem('currentUser')).loginFlag,  
    }
      console.log("Body Of Fill attendace true",  this.body); 
    }
    else {
      console.log("the currentTime is the date is =====>", this.currentTime.date);
      if (this.lastDate === this.currentTime.date) {
      this.body = {
      userId : JSON.parse(localStorage.getItem('currentUser'))._id,
      loginFlag : JSON.parse(localStorage.getItem('currentUser')).loginFlag,  
      lastLog: JSON.parse(localStorage.getItem('olddate')).dates,
      }
    }
      console.log("Body Of Fill attendace false",  this.body); 
    }
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/fill-attendance" , this.body);	
  }
  
  getLastFiveDaysAttendance(id){
    if(id == 0){
      var body = {
        userId : JSON.parse(localStorage.getItem('currentUser'))._id,
        days : '5'
      }
    }else{
      var body = {
        userId : id,
        days : '5'
      } 
    }
    console.log(body);
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-last-five-days-logs" , body);  
  } 

  getCurrent(){
    return this._http.get( config.baseApiUrl+"constant-call");
  }

  getLogsCountByMonthDefault(){
    var body = {}
    body['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
    return this._http.post("https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-current-month-logs-count" , body);      
  }
  getLogsByMonthDefaultByPage(body){
    if(JSON.parse(localStorage.getItem('currentUser')).userRole ){
      body['userRole'] = JSON.parse(localStorage.getItem('currentUser')).userRole;
    }
    body['userId'] = JSON.parse(localStorage.getItem('currentUser'))._id;
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-current-month-logs-by-page" , body);      
  }
  getLogsReportById(body){
    console.log(body);
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-report-by-id" , body);      
  }
}
