import { Component, OnInit } from '@angular/core';
import { Platform, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  userInfo:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _router: Router,
    private _nav: NavController,
    private loginService: LoginService
    ) {
    this.initializeApp();
    this.loginService.isLoggedIn.subscribe((data) => {
      if(data === 'loggedIn') {
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
      }
    })
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    if(!this.userInfo){
      this._router.navigate(['/login']);
    }else{
      console.log("called 2nd time");
      console.log(this.userInfo);
      this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
      this._router.navigate(['/']);
    }
  }

  logout() {
    this.loginService.logout();
    this._router.navigate(['login']);
    localStorage.removeItem('currentUser');
  }
}
