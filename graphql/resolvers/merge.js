var DataLoader = require('dataloader');

var Event = require('../../models/event');
var User = require('../../models/user');
var { dateToString } = require('../../helpers/date');

var eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

var userLoader = new DataLoader(userIds => {
  return User.find({ listing_id: { $in: userIds } });
});

var events = async eventIds => {
  try {
    var events = await Event.find({ listing_id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a.listing_id.toString()) - eventIds.indexOf(b.listing_id.toString())
      );
    });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

var singleEvent = async eventId => {
  try {
    var event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

var user = async userId => {
  try {
    var user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      listing_id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

var transformEvent = event => {
  return {
    ...event._doc,
    listing_id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

var transformBooking = booking => {
  return {
    ...booking._doc,
    listing_id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;