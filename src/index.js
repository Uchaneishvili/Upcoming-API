import mongoose from 'mongoose'
import app from './app.js'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import { Router } from 'express'
import bodyParser from 'body-parser'
import { Logger } from './util/Logger.js'

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

const swaggerOption = {
  swaggerDefinition: {
    info: {
      title: 'TvinUP API ',
      description: 'TvinUP API Information',
      version: '1.0.0',
    },
    contact: {
      name: 'Giga Uchaneishvli',
    },
    servers: ['http://localhost:3000/'],
  },
  apis: ['*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOption)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const router = Router()

const options = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: true,
  credentials: true,
}

router.use(cors(options))
