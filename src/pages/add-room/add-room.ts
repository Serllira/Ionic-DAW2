import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'Firebase';

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {

  data = { roomname:'', id:'', createdBy:'' };
  ref = firebase.database().ref('rooms/');
  private user: firebase.User;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname,
      createdBy: firebase.auth().currentUser.email
    });
    this.navCtrl.pop();
  }

}
