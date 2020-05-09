import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  { config } from '../config'; 

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  currentTime:any;

  constructor(public _http: HttpClient,
    ) { 
    if (localStorage.getItem('olddate')) {
      this.currentTime = JSON.parse(localStorage.getItem('olddate'));
      console.log("the currentTime time is ========>", this.currentTime);
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
  body:any;
  fillAttendance(){
    if (localStorage.getItem('olddate') == null) {
    this.body = {
      userId : JSON.parse(localStorage.getItem('currentUser'))._id,
      loginFlag : JSON.parse(localStorage.getItem('currentUser')).loginFlag,  
    }
      console.log("Body Of Fill attendace true",  this.body); 
    }
    else {
      this.body = {
      userId : JSON.parse(localStorage.getItem('currentUser'))._id,
      loginFlag : JSON.parse(localStorage.getItem('currentUser')).loginFlag,  
      lastLog: JSON.parse(localStorage.getItem('olddate')).dates,
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

    /*Services called from logs-summary*/
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

  //admin functions
  getTodaysAttendance(){
    var body = {
      "branch" : localStorage.getItem('branchSelected')
    }
    console.log("body in service " , body);
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-todays-day-logs" , body);
  }
  getLogsBySingleDate(data){
    console.log(data);
    data['branch'] = localStorage.getItem('branchSelected');
    return this._http.post("https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-logs-by-single-date" , data);
  }
  getReportFlagWise(body){
    console.log(body);
    body['branch'] = localStorage.getItem('branchSelected');
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"attendance/get-report-by-flag" , body);
  }

    getAllUsers(){
    var body = {
      'branch' : localStorage.getItem('branchSelected')
    }
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"user/get-users" , body);  
  }
  
  getUserById(id){
    console.log("the id is =========>", id);
    return this._http.get( "https://attendance.raoinformationtechnology.com:4000/"+"user/get-user-by-id/"+id);  
  }

  getEditById(id, value){
    console.log("the service data is: ", id, value);
    return this._http.put( "https://attendance.raoinformationtechnology.com:4000/"+"user/update-user-by-id/"+id,value);  
  }

  adminAddEmployee(value){
    console.log("the service data is: ", value);
    return this._http.post( "https://attendance.raoinformationtechnology.com:4000/"+"user/signup", value);  
  }

  adminDelEmployee(id){
    // console.log("the service del id is:", id);
    return this._http.delete( "https://attendance.raoinformationtechnology.com:4000/"+"user/delete-user-by-id/"+id);  
  }
}
