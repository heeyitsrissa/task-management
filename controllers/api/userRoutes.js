const router = require('express').Router();
const { User } = require('../../models');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oidc');
// const registerRoute = require('./registerRoute');

// router.post('/register', registerRoute.registerUser);

// passport.use(new GoogleStrategy({
//   clientID: process.env['GOOGLE_CLIENT_ID'],
//   clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//   callbackURL: '/oauth2/redirect/google',
//   scope: ['profile']
// }, function verify(issuer, profile, cb) {
//   db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
//     issuer,
//     profile.id
//   ], function (err, row) {
//     if (err) { return cb(err); }
//     if (!row) {
//       db.run('INSERT INTO users (name) VALUES (?)', [
//         profile.displayName
//       ], function (err) {
//         if (err) { return cb(err); }

//         var id = this.lastID;
//         db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
//           id,
//           issuer,
//           profile.id
//         ], function (err) {
//           if (err) { return cb(err); }
//           var user = {
//             id: id,
//             name: profile.displayName
//           };
//           return cb(null, user);
//         });
//       });
//     } else {
//       db.get('SELECT * FROM users WHERE id = ?', [row.user_id], function (err, row) {
//         if (err) { return cb(err); }
//         if (!row) { return cb(null, false); }
//         return cb(null, row);
//       });
//     }
//   });
// }));

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

// router.get('/login', function (req, res, next) {
//   res.render('login');

// });

// router.get('/login/federated/google', passport.authenticate('google'));

// router.get('/oauth2/redirect/google', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));




router.post('/register', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.user_id = userData.id;
    req.session.logged_in = true;
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    res.status(400).json(err);
  }
});



router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData || !(await userData.checkPassword(req.body.password)
    )) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    req.session.user_id = userData.id;
    req.session.logged_in = true;
    req.session.save(() => {
      res.redirect('/');   
    });
    
  } catch (err) {
    res.status(400).json(err);
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); 
    res.status(204).json({ message: 'Logged out successfully' });
  });
});




module.exports = router;

