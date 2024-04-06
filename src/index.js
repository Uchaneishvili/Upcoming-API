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
import request from 'request'

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

const addEmailToMailChimp = (email) => {
  const mailchimpApiKey = 'a62f83324c3492140162a0b1bee60123-us22'
  const listId = 'e0068ab548'
  const datacenterPrefix = mailchimpApiKey.split('-')[1]

  const options = {
    method: 'POST',
    url: `https://${datacenterPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/`,
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic YW55c3RyaW5nOmE2MmY4MzMyNGMzNDkyMTQwMWEyYTBiMWJlZTYwMTIzLXVzMjI=',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
    }),
  }

  request(options, (error, response) => {
    if (error) throw new Error(error)
  })
}

app.post('/addToMailChimp', async (req, res) => {
  try {
    addEmailToMailChimp(req.body.email)

    res.end('success')
  } catch (err) {
    console.log(err)
  }
})
app.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email

    const emailsExist = await EmailsModel.countDocuments({ email: email })

    if (emailsExist) {
      return recordAlreadyExists(res)
    }

    const rec = await new EmailsModel(req.body).save()

    return createdResponse(rec, res)
  } catch (error) {
    return handleError(error, res, 'Error while subscribing website.')
  }
})
const router = Router()

const options = {
  origin: ['http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: true,
  credentials: true,
}

router.use(cors(options))
