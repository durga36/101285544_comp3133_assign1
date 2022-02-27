var express = require('express')
var bodyParser = require('body-parser')
var graphqlHttp = require('express-graphql')
var mongoose = require('mongoose')

var graphQlSchema = require('./graphql/schema/app');
var graphQlResolvers = require('./graphql/resolvers/app');

var index = express();

index.use(bodyParser.json());

index.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  index.use(isAuth);

  index.use(
    '/graphql',
    graphqlHttp({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
  );

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
        process.env.MONGO_PASSWORD
    }@graphqlass1.2rg33.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
)
.then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });