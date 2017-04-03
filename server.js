let express = require('express');
let session = require('express-session');
let redis = require('redis');
let redisStore = require('connect-redis')(session);
let client = redis.createClient();
let bodyParser = require('body-parser');
let validate = require('express-validation');
let HttpStatus = require('http-status-codes');
let app = express();
let responseFormatter = require('./lib/responseFormatter');
let sessionData;

app.use(session({secret: '43@#463',
        store : new redisStore({ host: 'localhost', port : 6379,
	client : client, ttl:260}),
        cookie : { maxAge:1600000, secure : false},
        resave:false, saveUninitialized : true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(function (req, res, next) {
            // Website you wish to allow to connect
           // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            // Pass to next layer of middleware
            next();
        });

app.get('/', (req, res) => {
  sessionData = req.session;
  if(sessionData.email && sessionData.username)
  {
   let data =  {  email : sessionData.email,
	          username : sessionData.username
		  }
    res.send(responseFormatter(HttpStatus.OK, data));
  }
  else {
       let data = {message : 'no session data available'};
      res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, data));
  }
});


app.post('/', validate(require('./validation/login')),  (req, res) => {
   console.log(`Validator => ${require('./validation/login')}`);

   sessionData = req.session;
   let data = req.body;
   sessionData.email = data.email;
   sessionData.username = data.username;
   console.log(`Data Received => ${JSON.stringify(sessionData)}`);
   res.send('Data saved successfully');

});
app.use(function(err, req, res, next){
  res.status(400).json(err);
  });
   

app.listen(8070, ()=>{ console.log('Server started on port 8070');});
//Test f


module.exports = app;
