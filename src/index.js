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
  successResponse,
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
  var options = {
    method: 'POST',
    url: 'https://us8.api.mailchimp.com/3.0/lists/467c7ef468/members/',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic YW55c3RyaW5nOmIzZTJhYTM2ZTQ4YTc5NDAyMDJhMGNiNzBlZmY0MmU0LXVzOA==',
      Cookie:
        'ak_bmsc=EB8711EF19DED3EFCF857DC0FC00A87D~000000000000000000000000000000~YAAQxYYUAhM257eOAQAAdEdRxxd0+0U0djMzygSTQxPvtchOvZHJuDMzinOPXhvccY2flMI2obkDdO3a4S2nwiNSdiPohxPSXaaF+xLRQU7CzJ4MPU8cDsjh4cNcZz2TTlvxujq2cdwrhO94bMSCyWKqK7PZu0y9fHXm9rI1zxkGcJ7WUXD9jK4efYvQ0PtFqKqA3pZwcAVeruTVdsrw6H7yyaSYeBOmcYAxNmO3c2UcZ0f/TJgzPclFuICbzQh8kb6NNO02p0TaX+pN4JomuBmTSrzD5gDp4F50AFvUXaIosIq1kS/ZGBuN3dXCg5C0HkGKONYC+K7KunjhzPZMmT5We8bHl6KAJxDE9yVIS2yi1kBiiGkf9hT6fle0GMICKX8S; bm_sv=C6A83F2BBAA532D68024DE023CD83572~YAAQvIYUAnYkEomOAQAAIZ9/xxeiTU9d5yJfGBYDs5VZ3ozPEnUJKH4RowcWBTmTFpvRZZPHBrGKT/c4SukcEnSyHSrjz4LZaCaHrq/ZE93VUukp2XFZywLVD52BaZlBdmujKujDgflnzj77dIEmXz7X3vZU1el089E0Sx8RnMVCB89Nayhh9lyjHasOBWQekiHmXx/aFZwXx6OBIVWJtJzV7rU3Kq6wA+SFierNROStcuXpzMdczLNbKLBqJSSgXYcjKqtDMw==~1',
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      tags: ['TvinUP2'],
    }),
  }

  request(options, (error, response) => {
    if (error) throw new Error(error)
  })
}

app.post('/sendEmail', async (req, res) => {
  try {
    const emailsExist = await EmailsModel.countDocuments({
      email: req.body.email,
    })

    if (emailsExist) {
      return recordAlreadyExists(res)
    } else {
      addEmailToMailChimp(req.body.email)
      res.end('success')
    }
  } catch (err) {
    return handleError(error, res, 'Error while sending email.')
  }
})
app.post('/subscribe', async (req, res) => {
  try {
    const email = req.body.email

    const emailsExist = await EmailsModel.countDocuments({ email: email })

    if (emailsExist) {
      return recordAlreadyExists(res)
    } else {
      const rec = await new EmailsModel(req.body).save()

      return createdResponse(rec, res)
    }
  } catch (error) {
    return handleError(error, res, 'Error while subscribing website.')
  }
})

app.get('/emails', async (req, res) => {
  try {
    const quantity = await EmailsModel.countDocuments()

    return successResponse(quantity, res)
  } catch (error) {
    return handleError(error, res, 'Error while getting records.')
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
