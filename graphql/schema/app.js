var { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking{
    listing_id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type Event{
    listing_id: ID!
    listing_title: String!
    description: String!
    street: String!
    city: String!
    postal_code: String!
    price: Float!
    email: String!
    username: String!
}
type User{
    listing_id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}
type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
input EventInput{
    listing_title: String!
    description: String!
    street: String!
    city: String!
    postal_code: String!
    price: Float!
    email: String!
    username: String!
}

input UserInput{
    email: String!
    password: String!
}

type RootQuery{
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}


type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema{
    query: RootQuery
    mutation:RootMutation
}
`);