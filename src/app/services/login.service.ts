import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, NavController,ActionSheetController, MenuController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { of, pipe } from 'rxjs';
import { map, timeout} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import  { config } from '../config'; 
import { DashboardPage } from 'src/app/pages/dashboard/dashboard.page';
import { LogsSummaryPage } from 'src/app/pages/logs-summary/logs-summary.page';
import { UserProfilePage } from 'src/app/pages/user-profile/user-profile.page';
import { EditProfilePage } from 'src/app/pages/edit-profile/edit-profile.page';

@Injectable({
	providedIn: 'root'
})

export class LoginService {
	isLoggedIn: EventEmitter<any> = new EventEmitter<any>();
	private subject = new Subject<any>();

	private _UserMessage : BehaviorSubject<any>;
	public _user : Observable<any>;

	private currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<any>;

	constructor(public _http: HttpClient, public platform: Platform, public alertController: AlertController, public _router: Router) {
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

	getIpCliente(){
		console.log("called this ==>");
		return this._http.get('https://api.ipify.org') 
	}

	logout() {
		localStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);	
		this._router.navigate(['/login']);
	}

	sendMessage(message: string) {
		this.subject.next({ text: message });
	}

	getMessage(): Observable<any> {
		return this.subject.asObservable();
	}
}
