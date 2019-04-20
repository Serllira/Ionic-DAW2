import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase/app';
import {RoomPage} from "../room/room";


@IonicPage()
@Component({
  selector: 'page-ban-user',
  templateUrl: 'ban-user.html',
})
export class BanUserPage {

  roomkey: string;
  usuario: string;
  roomname: any;

  ref = firebase.database().ref('listaNegra/');

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase,
              public alertController: AlertController) {

    this.roomkey = this.navParams.get("roomkey") as string;
    this.roomname = this.navParams.get("roomname");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanUserPage');
  }

  banUser() {
    this.presentConfirm();
  }

  banUser2() {
    let baneado = false;
    this.ref.on("value", (snapshot) => {
      let result = snapshot.val();
      for (let k in result) {
        if (result[k].roomname === this.roomname && result[k].usuario === this.usuario) {
          baneado = true;
        }
      }

    });

    if (!baneado) {
      let newData = this.ref.push();
      newData.set({
        usuario: this.usuario,
        roomname: this.roomname
      });
      this.presentAlert2();
    } else {
      this.presentAlert();
    }

  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Error al banear usuario',
      subTitle: 'El usuario ' + this.usuario + ' ya se encuentra baneado',
      buttons: ['OK']
    });
    alert.present();
  }

  presentAlert2() {
    let alert = this.alertController.create({
      title: 'Usuario Baneado',
      subTitle: 'El usuario ' + this.usuario + ' ha sido baneado',
      buttons: ['OK']
    });
    alert.present();
  }

  presentConfirm() {
    let alert = this.alertController.create({
      title: 'Banear usuario',
      message: '¿Estás seguro de que banear al usuario: ' + this.usuario + '?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.banUser2();
          }
        }
      ]
    });
    alert.present();
  }

}
