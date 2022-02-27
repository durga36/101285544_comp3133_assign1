var Event = require('../../models/event');
var User = require('../../models/user');

var { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      var events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const event = new Event({
        listing_title: args.eventInput.title,
        description: args.eventInput.description,
        street: args.eventInput.street,
        city: args.eventInput.city,
        postal_code: args.eventInput.postal_code,
        price: +args.eventInput.price,
        email: args.eventInput.email,
      creator: req.userId
    });
    let createdEvent;
    try {
      var result = await event.save();
      createdEvent = transformEvent(result);
      var creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};