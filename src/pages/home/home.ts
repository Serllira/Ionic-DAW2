import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import * as firebase from "firebase";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(public navCtrl: NavController, private auth: AuthService) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage', firebase.auth().currentUser);
  }

  // getNick() {
  //   this.auth.getNick();
  // }

}
