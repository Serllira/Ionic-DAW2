import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {

  data = {roomname: '', id: '', createdBy: ''};
  ref = firebase.database().ref('rooms/');

  constructor(public navCtrl: NavController, public alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }

  addRoom() {
    let existe = false;

    this.ref.on("value", (snapshot) => {
      let result = snapshot.val();
      for (let i in result) {
        if (this.data.roomname === result[i].roomname) existe = true;
      }
    });

    if (existe) {
      this.presentAlert()
    } else {
      let newData = this.ref.push();
      newData.set({
        roomname: this.data.roomname,
        createdBy: firebase.auth().currentUser.email
      });
      this.navCtrl.pop();
    }

  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'La sala ya existe',
      subTitle: 'No se puede crear la sala, prueba con otro nombre',
      buttons: ['OK']
    });
    alert.present();
  }

}
