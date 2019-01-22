// tslint:disable-next-line:no-object-mutation
(global as any).window = {}

import 'zone.js/dist/zone-node'
import 'reflect-metadata'

import { resolve } from 'path'
import { enableProdMode } from '@angular/core'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader'
import * as express from 'express'
import * as cookies from 'cookie-parser'

enableProdMode()

const app = express()
const expressStaticGzip = require('express-static-gzip')
const baseDirectory = resolve('dist/flo-angular/browser')
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, SOME_TOKEN } = require('./dist/flo-angular/server/main')

app.use(cookies())
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    {
      provide: SOME_TOKEN,
      useValue: baseDirectory
    }
  ]
}))
app.set('view engine', 'html')
app.set('views', baseDirectory)

app.use('/', expressStaticGzip(baseDirectory, {
  enableBrotli: true,
  orderPreference: ['br', 'gzip'],
  maxAge: '7d',
  index: false
}))

app.get('*', (req, res) => {
  res.render('index', { req })
})

app.listen(process.env.PORT || 4201)

