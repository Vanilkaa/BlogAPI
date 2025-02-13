const express = require('express');
require('dotenv').config();
const passport = require('passport');

const app = express();

const port = process.env.PORT;
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const userRouter = require('./routes/user');

/*app.get('/protected', passport.authenticate('jwt', {session: false}),
    function(req, res) {
        res.send(req.user);
    })
*/

app.use('/', userRouter);

app.listen(port, console.log(`Server running on port ${port}`));