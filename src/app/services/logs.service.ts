import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import  { config } from '../config'; 

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(public _http: HttpClient) { }

  getCurrentDateLogById(){
  	console.log(" Into the service ");
  	var body = {
  		userId : JSON.parse(localStorage.getItem('currentUser'))._id
  	}
    console.log(body);
  	return this._http.post( config.baseApiUrl+"attendance/get-attendance-by-id" , body);	
  }
  fillAttendance(){
  	var body = {
  		userId : JSON.parse(localStorage.getItem('currentUser'))._id,
      loginFlag : JSON.parse(localStorage.getItem('currentUser')).loginFlag
  	}
    console.log("Body Of Fill attendace",  body);
  	return this._http.post( config.baseApiUrl+"attendance/fill-attendance" , body);	
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
  
}
