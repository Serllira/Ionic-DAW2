import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {
  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth, public afDB: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials) {
    console.log('Sign in with email');
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
    this.afDB.database.ref('users/'+datos.id).set(datos);
  }

   getNick() {
  //   let user = firebase.auth().currentUser;
  //   if(user !==null){
  //     firebase.database().ref().child("users").on('value', function(snapshot) {
  //       snapshot.forEach(function(child) {
  //         var datas = child.val();
  //         //var firstname=child.val().firstname;
  //         //var lastname=child.val().lastname;
  //         var nick=child.val().nick;
  //       });
  //     });
  //
  //   }
   }
}
