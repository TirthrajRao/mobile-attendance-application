import { Component, OnInit } from '@angular/core';
import { Platform, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  userInfo:any;

   public appPages = [
  {
    title: 'Dashboard',
    url: '/pages/dashboard',
    icon: 'paper-plane'
  },
  {
    title: 'Logout',
    url: '/login',
    icon: 'warning'
  }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _router: Router,
    private _nav: NavController
    ) {
    this.initializeApp();
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

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
