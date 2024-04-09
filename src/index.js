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

const sendEmail = (email) => {
  var options = {
    method: 'POST',
    url: 'https://us22.api.mailchimp.com/3.0/campaigns/09427e283b/actions/send',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic YW55c3RyaW5nOmE2MmY4MzMyNGMzNDkyMTQwMWEyYTBiMWJlZTYwMTIzLXVzMjI=',
      Cookie:
        'ak_bmsc=9F2B07D184D5E7BA1E04C08E0F46F5BA~000000000000000000000000000000~YAAQ1YYUAgjfw4eOAQAAcdvtshcyGoqGM/x1b1298Fts19AJMhW5vRF0vM/nrH5+0qhtJsuo2kWIxwOYbYXVgev5LnojuJKFVmoo0V8A26MyxmHpaxsDWOuSEJ57R22XSwaaiVaxnPrSVAnX6MlstMB4EK6ep/f000y/kuU7p69zbxMk3xZebvEBV3/GfqhugSQCif2Q403WhqciUB0ehIPe88/xj/NiEfzk5Y/IDjxt/rY4KBu0CVUIBalSdeMYR7m9tGqq0H776R2CDP3wXLXzxTKAiLBx2vNjojHZQcIOpfbBahL5KA9JmOOrIs7ELuNjtU7goPPLx5RQZNPyE6b5juH66S2ps7NEzhlaw+6j8Aqj5ceUvr815+mnXNOUzRIH; bm_sv=49DCEA42F4F84FF0D1982EC333C3F817~YAAQ1YYUAvP6w4eOAQAA4svvshcYPtclKUSV6Q4DyzwWNdXAVizU3x84bjWCzmayAuuE/WMkqv2aI8a6Hj1pIY5uJXOCM5WJbSw8rZaQ6SSGIcXLQP+yCZCdmyN5rW6rqbeCx34VUFR2tzaIENtv8LJPYlRm5K1X5iL9QmkYhoeq4v1SAY41ygFEd2+X0++3CxZgrjKXs8qHHlfgWOYtp/0GbZkDfbu3XTLLM40bh1U6SKnNGKBl86Z0rjsHabue48MB8OqWdw==~1',
    },
    body: JSON.stringify({
      email_address: email,
    }),
  }
  request(options, function (error, response) {
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
      sendEmail(req.body.email)
      res.end('success')
    }
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
    console.log(error)
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
