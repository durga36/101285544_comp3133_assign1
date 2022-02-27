var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User already exists.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      var user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      var result = await user.save();

      return { ...result._doc, password: null, listing_id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    var user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    var isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is not correct.');
    }
    var token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};