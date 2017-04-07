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
let authMiddleware = require('./lib/authMiddleWare');
let authorizer = require('./rbac/roleBase');

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
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

app.get('/', authMiddleware, (req, res) => {
  sessionData = req.session;
  if(sessionData.email && sessionData.username)
  {
   let data =  {  email : sessionData.email,
	          username : sessionData.username
		  };
    res.send(responseFormatter(HttpStatus.OK, data));
  }
  else {
       let data = {message : 'no session data available'};
       res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(responseFormatter(HttpStatus.INTERNAL_SERVER_ERROR, data));
  }
});

app.get('/rbac', authorizer.wants('viewFrontPage'),
    (req, res)=> {
        res.send(responseFormatter(HttpStatus.OK, 'You can do that Amigo'));
    });


app.post('/', validate(require('./validation/login')),  (req, res) => {
   sessionData = req.session;
   let data = req.body;
   sessionData.email = data.email;
   sessionData.username = data.username;
   sessionData.role = 'guest';
   res.send('Data saved successfully');

});
app.use(function(err, req, res, next){
    console.log(JSON.stringify(err));
  res.status(400).json(err);
  });
   

app.listen(8070, ()=>{ console.log('Server started on port 8070');});
//Test f


module.exports = app;
