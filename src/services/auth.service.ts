import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from '@angular/fire/database';


@Injectable()
export class AuthService {
  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signup2(datos) {
    let key = this.afDB.list('/users/').push(datos).key;
    datos.id = key;
    this.afDB.database.ref('users/' + datos.id).set(datos);
  }

  getUserData(userData) {
    let user_data = [];
    firebase.database().ref().child("users").on('value', (snapshot) => {
      let result = snapshot.val();
      for (let k in result) {
        if (userData === result[k].email) {
          user_data.push({
            id: k,
            email: result[k].email,
            nick: result[k].nick,
            admin: result[k].admin
          });
        }

      }
    });
    return user_data;
  }

}
