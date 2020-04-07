const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

exports.authLogin = (username, password, callback) => {
    User.find({username, password}, (err, user) => {
        if(err || !user) {
            console.log("Unauthorized user");
            return callback(err);
        } else if (user.length < 1) {
            console.log("No user found");
            return callback(err);
        } else {
            console.log("Authorized user");
            callback(null, user);
        }
    })
}