import firebase from "firebase/app"
import "firebase/firestore"

// Get a Firestore instance
export const db = !firebase.apps.length
  ? firebase
      .initializeApp({
        apiKey: "AIzaSyA6rPeqjwM5VitsnU9cdxAQsX9azToW0i0",
        authDomain: "vuefire-c0f73.firebaseapp.com",
        databaseURL: "https://vuefire-c0f73.firebaseio.com",
        projectId: "vuefire-c0f73",
        storageBucket: "vuefire-c0f73.appspot.com",
        messagingSenderId: "417551668035",
        appId: "1:417551668035:web:7c3da2477047ba520a55f6",
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
