require('dotenv').config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('./auth/passport');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');
const materialsRouter = require('./routes/materials');
const wishlistRouter = require('./routes/wishlist');
const factsRouter = require('./routes/facts');

const secret = require('./secret');
const { checkUserLogged } = require('./auth/helpers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
  }))
  
  app.use(passport.initialize())
  app.use(passport.session())



app.use('/api/auth', authRouter);
app.use('/api/users', checkUserLogged, usersRouter);
app.use('/api/brands', checkUserLogged, brandsRouter);
app.use('/api/materials', /*checkUserLogged,*/ materialsRouter);
app.use('/api/wishlist', /*checkUserLogged,*/ wishlistRouter);
app.use('/api/facts', /*checkUserLogged,*/ factsRouter);


// app.use('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
// });

module.exports = app;
