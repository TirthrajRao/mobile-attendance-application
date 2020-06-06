import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, pipe } from 'rxjs';
import { map, timeout} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import  { config } from '../config'; 
import { Platform } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})

export class LoginService {
	isLoggedIn: EventEmitter<any> = new EventEmitter<any>();
	private currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<any>;
	constructor(public _http: HttpClient, public platform: Platform) {
		this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}
	public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

	loginUser(body ){
		return this._http.post(	config.baseApiUrl+"user/login" , body)
		.pipe(map(user => {
			console.log("login user=========>", user);
			if (user) {
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.isLoggedIn.emit('loggedIn');
				this.currentUserSubject.next(user);
			}
			return user;
		}));
	}

	logout() {
        localStorage.removeItem('currentUser');
     	this.currentUserSubject.next(null);	
    }
}
