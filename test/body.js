'use strict';

let app = require('../server');
let request = require('supertest')(app);
let joi = require('joi');


let invalidSchema = {
       status : joi.number().integer().required(),
       statusText : joi.string().valid('Bad Request').required(),
       errors : joi.array().required().items(
        joi.object().required().keys({
	  field : joi.string().required(),
	  location : joi.string().required(),
	  messages : joi.array().required().items(
	          joi.string().optional()
	  ),
	  types : joi.array().required().items (
	        joi.string().optional()
	  )
	})
       )

    };


describe('when the request has a missing item in payload', function () {
  it('should return a 400 ok response and a single error', function(done){
 
    let login = {
        email: "andrew.keig@gmail.com"
    };
 
    request.post('/')
      .send(login)
      .expect('Content-type', /json/)
      .expect(400)
      .expect(res => {
         joi.assert(res.body, invalidSchema);
      })
      .end(done);
    });
});




