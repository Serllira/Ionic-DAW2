import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Content, AlertController} from 'ionic-angular';
import {RoomPage} from '../room/room';
import * as firebase from 'firebase/app';
import {AuthService} from "../../services/auth.service";
import {BanUserPage} from "../ban-user/ban-user";
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Content) content: Content;

  data = {type: '', nickname: '', message: ''};
  chats = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;
  roomname: any;
  createdBy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, public afDB: AngularFireDatabase, public alertController: AlertController) {
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nick") as string;
    this.roomname = this.navParams.get("roomname");
    this.createdBy = this.navParams.get("createdBy");
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    joinData.set({
      type: 'join',
      user: this.nickname,
      message: this.nickname + ' se ha unido a la sala.',
      sendDate: Date()
    });
    this.data.message = '';

    firebase.database().ref('chatrooms/' + this.roomkey + '/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);

      /* Descomentar para transición automática hasta el final del chat*/

      /*setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
        if(this.content._scroll){
          this.content.scrollToBottom(0);
        }
      }, 1000);*/
    });
  }

  sendMessage() {
    let newData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.data.message,
      sendDate: Date()
    });
    this.data.message = '';
  }

  exitChat() {
    let exitData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    exitData.set({
      type: 'exit',
      user: this.nickname,
      message: this.nickname + ' ha abandonado la sala.',
      sendDate: Date()
    });

    this.offStatus = true;

    this.navCtrl.setRoot(RoomPage, {
      nickname: this.nickname
    });
  }

  presentAlert() {
    let alert = this.alertController.create({
      title: 'Sala borrada',
      subTitle: 'La sala ' + this.roomname + ' se ha borrado con éxito',
      buttons: ['OK']
    });
    alert.present();
  }

  banUser() {
    this.navCtrl.push(BanUserPage, {roomkey: this.roomkey, roomname: this.roomname});
  }

  deleteRoom() {
    this.presentConfirm();
  }

  presentConfirm() {
    let alert = this.alertController.create({
      title: 'Borrar sala',
      message: '¿Estás seguro de que quieres borrar esta sala?',
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
            this.afDB.database.ref('rooms/' + this.roomkey).remove();
            this.afDB.database.ref('chatrooms/'+ this.roomkey).remove();
            this.presentAlert();
            this.navCtrl.setRoot(RoomPage);
          }
        }
      ]
    });
    alert.present();
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

