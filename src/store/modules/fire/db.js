import firebase from "firebase/app"
import "firebase/firestore"

// Get a Firestore instance
export const db = !firebase.apps.length
  ? firebase
      .initializeApp({
        apiKey: "AIzaSyAFS-HR7KqtB7C9qLpF56f-zl5jMiohNkI",
        authDomain: "dryclean-gallery.firebaseapp.com",
        databaseURL: "https://dryclean-gallery-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "dryclean-gallery",
        storageBucket: "dryclean-gallery.appspot.com",
        messagingSenderId: "738933738349",
        appId: "1:738933738349:web:8a2777b16b1ec7fb9aa864",
        measurementId: "G-V4H3PQX2N4",
      })
      .firestore()
  : firebase.app().firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore
export { TimeStamp, GeoPoint }

// if using Firebase JS SDK < 5.8.0
// db.settings({
//   timestampsInSnapshots: true,
// })
