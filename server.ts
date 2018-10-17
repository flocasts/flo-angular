import * as express from 'express'
import { resolve } from 'path'

const app = express()
const expressStaticGzip = require('express-static-gzip')

app.use('/', expressStaticGzip('dist/flosports-component-library', {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'],
  maxAge: '7d'
}))

app.get('**', (_, res) => {
  res.sendFile(resolve('dist/flosports-component-library/index.html'))
})

app.listen(process.env.PORT || 4201)

