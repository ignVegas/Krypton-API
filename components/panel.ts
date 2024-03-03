// Express
import express from 'express'
const router: express.Router = express.Router()

// Utility
import db from './../utility/database'
import Joi from 'joi'
/* 
router.use((req, res) => {
    if(!req.session.data && req.method != "GET")
        return res.json({
            success: false,
            message: "Invalid session",
            path:    req.path
        })
}); */

router.get('/', async(req, res) => {
    if(!req.session.data)
        return res.render('panel/login.ejs')

    let userData = await db.query(`SELECT * FROM users`, []);
    if(userData.err)
        return res.send(`Database Error: ${userData.err}`)

    return res.render("panel/panel.ejs", {
        session: req.session.data || null,
        data: userData.res
    })
})


// New user
const userSchema = Joi.object( {
    username:   Joi.string().required().max(64).min(1),
    hwid:       Joi.string().max(512),
    license: Joi.number().required().valid(0, 1)
})
router.post('/new', async(req, res) => {
    if(!req.session.data)
        return res.json({
            success: false,
            message: "Please re-log"
        })

    let validation = userSchema.validate(req.body)
    if(validation.error)
        return res.json({
            succcess: false,
            message: validation.error
        })

    let insert = await db.query(`INSERT INTO users (username, hwid, license) VALUES (?, ?, ?)`, [
        validation.value.username,
        validation.value.hwid,
        validation.value.license
    ]);

    if(insert.err)
        return res.send(`Database Error: ${insert.err}`);

    return res.json({
        success: true,
        message: "Successfully added user"
    })
})

router.post('/delete', async(req, res) => {
    if(!req.session.data)
        return res.json({
            success: false,
            message: "Please re-log"
        })

    if(!req.body?.id)
        return res.json({
            success: false,
            message: "Invalid request"
        })

    let del = await db.query(`DELETE FROM users WHERE id = ?`, [
        req.body.id
    ]);

    if(del.err)
        return res.send(`Database Error: ${del.err}`);

    return res.json({
        success: true,
        message: "Successfully removed user"
    })
})

// Password protected log in
router.post('/login', (req, res) => {
    if(req.body?.password != process.env.PANEL_PASSWORD)
        return res.json({
            success: false,
            message: "Wrong password"
        })

    req.session.data = {
        logged: true
    }

    return res.json({
        success: true,
        mesasge: "Successfully logged in"
    })
})

export = router