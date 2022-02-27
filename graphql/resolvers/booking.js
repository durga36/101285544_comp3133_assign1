var Event = require('../../models/event');
var Booking = require('../../models/booking');
var { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      var bookings = await Booking.find({user: req.userId});
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    var fetchedEvent = await Event.findOne({ listing_id: args.eventId });
    var booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    var result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      var booking = await Booking.findById(args.bookingId).populate('event');
      var event = transformEvent(booking.event);
      await Booking.deleteOne({ listing_id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};