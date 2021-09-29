import firebase from "firebase/app"
let TimeNow = firebase.firestore.FieldValue.serverTimestamp()
export const withCreateTimeStamp = (data) => {
  data.createdAt = TimeNow
  data.updateAt = TimeNow
  return data
}

export const withUpdateTimeStamp = (data) => {
  data.updateAt = TimeNow
  return data
}
