import app from 'firebase';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyCOiiIwFklgSsObI8BwfWajiHitYoNPNt0",
  authDomain: "autosphinx-b8f4d.firebaseapp.com",
  databaseURL: "https://autosphinx-b8f4d.firebaseio.com",
  projectId: "autosphinx-b8f4d",
  storageBucket: "autosphinx-b8f4d.appspot.com",
  messagingSenderId: "255617282904",
  appId: "1:255617282904:web:23bda52c91d6eeb3"
}

class Firebase {

  // Inicializa la configuracion de Firebase.
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    console.log("Initializing Firebase.");
  }

  // Loguea un usuario usando email y password.
  signIn = (creds) => {
    const { email, password } = creds;
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  //Desloguea al usuario
  signOut = () => this.auth.signOut();

  // Obtiene la instancia del usuario que esta actualmente logueado.
  getCurrentUser = () => {
    console.log(this.auth.currentUser);
    return this.auth.currentUser;
  }

  cars = () => this.db.collection('cars');

}

export default new Firebase();