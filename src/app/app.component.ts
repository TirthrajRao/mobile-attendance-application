import { Component, OnInit } from '@angular/core';
// import { Nav, Platform } from 'ionic-angular';
import { Platform, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { DashboardPage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { DashboardPage } from './pages/dashboard/dashboard.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  userInfo:any;

    // appPages: Array<{title: string, component: any}>;

  
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
   public appPages = [
  // {
  //   title: 'Inbox',
  //   url: '/folder/Inbox',
  //   icon: 'mail'
  // },
  {
    title: 'dashboard',
    url: '/pages/dashboard',
    icon: 'paper-plane'
  },
  // {
  //   title: 'Favorites',
  //   // url: '/folder/Favorites',
  //   icon: 'heart'
  // },
  // {
  //   title: 'Archived',
  //   url: '/folder/Archived',
  //   icon: 'archive'
  // },
  // {
  //   title: 'Trash',
  //   url: '/folder/Trash',
  //   icon: 'trash'
  // },
  // {
  //   title: 'Spam',
  //   url: '/folder/Spam',
  //   icon: 'warning'
  // }
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

    // const path = window.location.pathname.split('folder/')[1];
    // if (path !== undefined) {
    //   this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    // }
  }

  //  openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this._nav.setRoot(page.component);
  // }
}
