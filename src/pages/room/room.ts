import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {AddRoomPage} from '../add-room/add-room';
import {AuthService} from '../../services/auth.service';
import {HomePage} from '../home/home';
import * as firebase from 'firebase/app';


@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {

  rooms = [];
  ref = firebase.database().ref('rooms/');
  ref2 = firebase.database().ref('listaNegra/');

  constructor(public navCtrl: NavController, private auth: AuthService, public alertController: AlertController) {
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  joinRoom(key, roomname, createdBy) {
    let canJoin = true;
    this.ref2.on("value", (snapshot) => {
      let result = snapshot.val();
      for (let k in result) {
        if (roomname === result[k].roomname && firebase.auth().currentUser.email === result[k].usuario) {
          canJoin = false;
          this.presentAlert();
        }
      }
      if (canJoin) {
        this.navCtrl.setRoot(HomePage, {
          key: key,
          nick: this.getNick(),
          roomname: roomname,
          createdBy: createdBy
        });
      }
    });

  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Acceso bloqueado',
      subTitle: 'Has sido baneado de este chat',
      buttons: ['OK']
    });
    alert.present();
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  getNick() {
    for (let userData of this.auth.getUserData(this.auth.getEmail())) {
      return userData.nick;
    }
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
