import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
})

const EmailsModel = mongoose.model('emails', productSchema)

export { EmailsModel }
