const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, async function(jwt_payload, done) {
        const user = await prisma.user.findUnique({
            where: {
                id: jwt_payload.sub,
            },
        })
        
        if (user) {
            return done(null, user)
        } else {
            return(null, false)
        }
        
    }));
}