const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { stringify } = require("querystring");
const emailValidator = require("email-validator");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
    validate: {
      validator: emailValidator.validate,
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

UserSchema.pre("save", async function preSave(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  const query = { username };
  User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) {
        throw error;
      }

      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, arePasswordMatching) => {
    if (err) {
      throw err;
    }

    callback(null, arePasswordMatching);
  });
};
