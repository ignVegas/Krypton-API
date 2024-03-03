/**
 * @name KryptonAP
 * @description Krypton Admin Panel
 * @author Tino Pai
 * @license MIT
 */

// Express
import express from 'express'
const app: express.Application  = express()

// EJS
app.set('view engine', 'ejs')

// Utility
import bodyParser from 'body-parser'
app.use(bodyParser.json())

import * as dotenv from 'dotenv'
dotenv.config()

// Session
import session from 'express-session'

declare module "express-session" {
    interface Session {
        data: object
    }
}

const secret: string = process.env.SESSION_SECRET || 'moo cow'
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: secret,
    })
)

// Assets
app.use('/assets', express.static('./views/assets'))

// Homepage
app.get('/', (req, res) => {
    res.redirect('/admin')
})

// Panel
const panel = require('./components/panel')
app.use('/admin', panel)

// Listen
import http from 'http'
const port: string = process.env.PORT || "80"
http.createServer(app)
.listen(port, () => {
    console.info(`Listening to http(s)://*:${process.env.PORT}`)
})