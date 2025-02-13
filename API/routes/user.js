const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = require('express').Router();
const passport = require('passport');
const utils = require('../lib/utils');

router.post('/login', async function(req, res){
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    })

    if (!user) {
        return res.status(401).json({ success: false, msg: "could not find user" });
    }
            
    const isValid = utils.validPassword(req.body.password, user.password, user.salt);

    if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
    } else {
        res.status(401).json({ success: false, msg: "you entered the wrong password" });
    }
})

router.post('/register', async function(req, res, next){
    console.log(req.body);
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    const newUser = await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            password: hash,
            salt: salt,
        }
    })
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        }
    })
    if (user) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
    } else res.json({ success: false });
});

module.exports = router;