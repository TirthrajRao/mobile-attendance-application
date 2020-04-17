import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ActionSheetController, ToastController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormGroup , FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import {  ViewChildren, QueryList } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import {Toast} from "@ionic-native/toast";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  userInfo:any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _router: Router,
    private _nav: NavController,
    private actionSheetCtrl: ActionSheetController,
    private toast: ToastController,
    private loginService: LoginService
    ) {
    this.initializeApp();
    this.loginService.isLoggedIn.subscribe((data) => {
      if(data === 'loggedIn') {
        this.userInfo = JSON.parse(localStorage.getItem("currentUser"));
      }
    });

    this.backButtonEvent();
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
