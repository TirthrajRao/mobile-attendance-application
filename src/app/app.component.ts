import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import {  ViewChildren, QueryList } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  userInfo:any;
  navigate:any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  subscribe:any;

  
  public selectedIndex = 0;
  public appPages = [
  {
    title: 'Dashboard',
    url: '',
    icon: 'home'
  },
  {
    title: 'Logs-Summary',
    url: 'logs-summary',
    icon: 'list'
  },
  {
    title: 'User-Profile',
    url: 'user-profile',
    icon: 'person'
  },
  {
    title: 'Log-out',
    url: 'login',
    icon: 'exit'
  }
  ];
  
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _router: Router,
    private _nav: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toast: ToastController,
    private loginService: LoginService,
    private _loadingController: LoadingController,
    public alertController: AlertController
    )  {
    this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    this.initializeApp();
    
    this.loginService.isLoggedIn.subscribe((data) => {
      if(data === 'loggedIn') {
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
      }
    });

    this.backButtonEvent();
  }

  private loading;
  ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
    if(!this.userInfo){
      this._router.navigate(['/login']);
    }else{
      console.log("called 2nd time");
      console.log(this.userInfo);
      this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
      this._router.navigate(['/']);
    }

    this.subscribe = this.platform.backButton.subscribeWithPriority(666666,() => {
      if (this.constructor.name == "DashboardPage") {
        if (window.confirm("do you want to exit app")) {
          navigator["app"].exitApp();
        }
      }
    })
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      try {
        const element = await this.actionSheetCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
      }
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this._router.url === '') {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); 
          }
        }
      });
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.loginService.logout();
    this._router.navigate(['login']);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('olddate');
    localStorage.removeItem('date');
  }
}
