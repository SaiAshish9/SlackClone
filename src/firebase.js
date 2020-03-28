
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBuQRPGe1WNWxyPwUfI7vGg1Qg1etMirjk",
    authDomain: "slackclone-2c815.firebaseapp.com",
    databaseURL: "https://slackclone-2c815.firebaseio.com",
    projectId: "slackclone-2c815",
    storageBucket: "slackclone-2c815.appspot.com",
    messagingSenderId: "1091033003201",
    appId: "1:1091033003201:web:4e49a0e7919e57b8cb9040",
    measurementId: "G-TBWH8JELQR"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase