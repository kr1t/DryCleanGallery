import { firestore } from "firebase"

import { Model } from "@vuex-orm/core"
import User from "./User"
const collName = "Posts"

export default class Post extends Model {
  static entity = "posts"

  // `this.belongsTo` is for belongs to relationship. The first argument is
  // the Model class, and second is the field name for the foreign key.
  static beforeCreate(model) {
    firestore()
      .collection(collName)
      .add({ ...model })
  }

  arm() {
    console.log("arm")
  }

  static fields() {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr(""),
      body: this.attr(""),
      published: this.attr(false),
      author: this.belongsTo(User, "user_id"),
    }
  }
}
