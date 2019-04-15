var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserCollection = require('../models/UserSchema');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  UserCollection.findById(id, function(err, user) {
    done(err, user);
  });
});

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

//cookie check
router.get('/', (req, res) => {
  console.log(req.session.username);

  if (req.session.username) {
    res.send(req.session.username);
  } else {
    res.send(null);
  }
});

//log out route
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session=null;
    res.send("Logged Out");
  } else {
    res.send("Not logged in");
  }
});

// Login User Strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log("Local Strat");
      UserCollection.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!isValidPassword(user, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        else{
          console.log(user);
          return done(null, user, { user: user.username });
        }
      });
    }
));

//Login User Route
router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/users/loginfail' }),

    function(req, res) {
      req.session.username=req.body.username;
      res.send(req.body.username);
    });

//Login Failure Redirect
router.get('/loginfail', (req, res)=>{
  res.send(undefined)
});

// New User Strategy
passport.use('signup', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      findOrCreateUser = function(){
        // find a user in Mongo with provided username
        UserCollection.findOne({'username':username},function(err, user) {
          if (err){
            console.log('Error in SignUp: '+err);
            return done(err);
          }
          if (user) {
            console.log('User already exists');
            return done(null, false,
                { message: 'User already exists.' }
            );
          } else {
            var newUser = new UserCollection();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.email = req.body.email;

            // save the user
            newUser.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);
                throw err;
              }
              console.log('User Registration successful');
              return done(null, newUser);
            });
          }
        });
      };
      //I have no idea why we do this??
      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    })
);

// New User Routes
router.post('/newUser',
    passport.authenticate('signup',
        { successRedirect: '/users/successNewUser',
          failureRedirect: '/users/failNewUser'
        }
    ),
    function(req, res) {
      res.send('Authenticated!');
    });

//New User Success Redirect
router.get('/successNewUser', (req, res)=>{
  res.send("Added New User")
});

// New User Fail Redirect
router.get('/failNewUser', (req, res)=>{
  console.log("Failed New User");
});

module.exports = router;
