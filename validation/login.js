'use strict';

let Joi = require('joi');

module.exports = {

  body: {
     username : Joi.string().required(),
     email : Joi.string().email().required()
  }

};
