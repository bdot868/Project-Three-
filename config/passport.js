const
  dotenv = require('dotenv').load({silent: true}),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('../models/User.js'),
  FacebookStrategy = require('passport-facebook').Strategy;


//Generate a cookie string (encoded string out of user's ID)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

//Decode an incoming cookie (translate it back into a user object)
passport.deserializeUser((id, done) => {
  User.findById(id, (err,user) => {
    done(err,user)
  })
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'local.email': email}, (err,user)=> {
    if (err) return done(err)
    if (user) return done(null, false, req.flash('signupMessage', 'Email is already in use. Please Sign in or use another email.'))

    var newUser = new User()
    newUser.local.firstname = req.body.firstname
    newUser.local.lastname = req.body.lastname
    newUser.local.email = req.body.email
    newUser.local.password = newUser.generateHash(req.body.password)
    newUser.save((err, newlyCreatedUser) =>{
      if (err) return console.log(err)
      return done(null, newlyCreatedUser, null)
    })
  })
}))

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({'local.email':email}, (err,user) =>{
    if (err) return done(err)
    if (!user) return done(null, false, req.flash('loginMessage', 'The email and password combination you entered could not be found. Please try again.'))
    if (!user.validPassword(password)) return done(null,false, req.flash ('loginMessage'))

    return done(null, user)
  })
}))


passport.use(new FacebookStrategy({
  clientID: process.env.Facebook_clientID,
  clientSecret: process.env.Facebook_clientSecret,
  callbackURL: "https://travelpackr.herokuapp.com/auth/facebook/callback",
   //callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ['id', 'email', 'first_name', 'last_name']

},
function(token, refreshToken, profile, done) {
  console.log("Facebook profile:")
  // console.log(profile)
 process.nextTick(function(){
   User.findById(profile._id, function(err, user) {
     var fbuser = profile
     if(err) {
       console.log('im in err')
       return done(err)
     };

     if(user) {
        console.log('im user')
      //  console.log(fbuser)
       return done(null, user);
     } else {
       var newUser = new User()
         console.log('im in new')
       newUser.facebook.id    = profile._id;
       newUser.facebook.token = token;
       newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
       newUser.facebook.email = profile.emails[0].value;

       newUser.save(function(err) {

         if(err)
           throw err;
           console.log(newUser)
           return done(null, newUser);

       });
     }
   });
 });
}));

module.exports = passport
