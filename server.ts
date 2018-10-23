import * as express from 'express'
import { resolve } from 'path'

const app = express()
const expressStaticGzip = require('express-static-gzip')
const baseDirectory = resolve('dist/flo-angular')

app.use('/', expressStaticGzip(baseDirectory, {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'],
  maxAge: '7d'
}))

app.get('**', (_, res) => {
  res.sendFile(resolve(baseDirectory, 'index.html'))
})

app.listen(process.env.PORT || 4201)

