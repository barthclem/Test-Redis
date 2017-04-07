'use strict';


module.exports = function ( httpStatus, data) {
   return {
       status : httpStatus,
       data : data
   };
};
