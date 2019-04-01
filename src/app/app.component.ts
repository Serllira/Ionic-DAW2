import {Component, ViewChild} from '@angular/core';
import { App, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {AuthService} from "../services/auth.service";
import {HomePage} from "../pages/home/home";
import {RoomPage} from "../pages/room/room";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  pages;
  rootPage;

  private app;
  private platform;
  private menu: MenuController;

  @ViewChild(Nav) nav: Nav;

  constructor(app: App, platform: Platform,
              menu: MenuController,
              private statusBar: StatusBar,
              private auth: AuthService) {
    this.menu = menu;
    this.app = app;
    this.platform = platform;
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Rooms', component: RoomPage, icon: 'home' },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });

    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.rootPage = RoomPage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(HomePage);
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}
