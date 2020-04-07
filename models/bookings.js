const mongoose = require("mongoose");

const schema = mongoose.Schema({
    package: String,
    name: String,
    email: String
});

const Booking = mongoose.model("Booking", schema);

exports.save = async ({package, name, email}) => {
    const booking = await (new Booking({package, name, email}).save());
    return booking;
}

exports.list = async () => {
    const bookings = await Booking.find({});
    return bookings;
}
