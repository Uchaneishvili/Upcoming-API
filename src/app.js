import express from 'express'
import { Logger } from './util/Logger.js'

const app = express()
const port = 3001
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  Logger.info(`Project is started and running on ${port}`)
})

export default app
