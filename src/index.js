import mongoose from 'mongoose'
import app from './app.js'
import cors from 'cors'
import { Router } from 'express'
import bodyParser from 'body-parser'
import { Logger } from './util/Logger.js'
import { EmailsModel } from './models/emails.js'
import {
  handleError,
  createdResponse,
  recordAlreadyExists,
} from './util/ApiResponse.js'

mongoose
  .connect(
    `mongodb+srv://guchaneishvili:guchaneishvili@tvinup-prelanding.ury0cwx.mongodb.net/?retryWrites=true&w=majority&appName=TvinUP-Prelanding`
  )
  .then((res) => {
    Logger.info('Connected to TvinUP API Database - Initial Connection ✅ 🚀')
  })
  .catch((err) => {
    Logger.info(
      `❌ Initial TvinUP API Database connection error occured -`,
      err
    )
  })

app.use(cors())
app.use(bodyParser.json())

app.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email

    const emailsExist = await EmailsModel.countDocuments({ email: email })

    if (emailsExist) {
      return recordAlreadyExists(res)
    }

    const rec = await new EmailsModel(req.body).save()
    return createdResponse(rec, res)
  } catch (err) {
    return handleError(error, res, 'Error while subscribing website.')
  }
})
const router = Router()

const options = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: true,
  credentials: true,
}

router.use(cors(options))
