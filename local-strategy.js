var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/User.js");
const bcrypt = require("bcrypt")

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findUser = await User.findById(id);
		if (!findUser) throw new Error("User Not Found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

module.exports = new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
	  try {
		const user = await User.findOne({ email });
  
		if (!user) {
		  return done(null, false, { message: 'Invalid email or password' });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
  
		if (!isPasswordValid) {

		  return done(null, false, { message: 'Invalid email or password' });
		}
  
		return done(null, user);
	  } catch (err) {
		return done(err);
	  }
	}
  );

