import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["host", "guest"],
  },
})

UserSchema.pre("save", async function (next) {
  console.log(this)
  const newUser = this
  const plainText = newUser.password
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainText, 10)
    console.log(newUser.password)
  }
  next()
})

UserSchema.statics.checkCredentials = async function (email, plainText) {
  const user = await this.findOne({ email })
  if (user) {
    const hashedPassword = user.password
    const isMatch = await bcrypt.compare(plainText, hashedPassword)
    if (isMatch) return user
    else return null
  } else {
    return null
  }
}
UserSchema.methods.toJSON = function () {
  const user = this
  const { name, email, role, _id } = user.toObject()
  return { name, email, role, _id }
}

export default mongoose.model("User", UserSchema)
