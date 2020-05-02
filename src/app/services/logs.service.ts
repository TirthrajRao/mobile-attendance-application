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
    return this._http.post( config.baseApiUrl+"attendance/get-attendance-by-id" , body);	
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
    return this._http.post( config.baseApiUrl+"attendance/fill-attendance" , this.body);	
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
    return this._http.post( config.baseApiUrl+"attendance/get-last-five-days-logs" , body);  
  } 

  getCurrent(){
    return this._http.get( config.baseApiUrl+"constant-call");
  }

}
