/**
 * Created by aanu.oyeyemi on 05/04/2017.
 */
'use strict';
let authorizor = require('authorizator');
let rolePolicy = authorizor.RoleBasedPolicy;
authorizor.initialize({path : 'session.role'});
authorizor.use('redisPolicy', rolePolicy);

function Role(roleName) {
    authorizor.addRole(roleName);
    this.role = authorizor.getRole(roleName);
}
Role.prototype.canDo = function can () {
    let actions = Array.prototype.slice.call(arguments);
    actions.forEach(action => {
        authorizor.addAction(action);
        let act = authorizor.getAction(action);
        this.role.can(act);
        act.requires(this.role);
    });
};


let guest = new Role('guest');
guest.canDo('viewFrontPage','peepOngoingEvents');

let superAdmin = new Role('superAdmin');
//superAdmin.inherits(guest);
superAdmin.canDo('addAdmin', 'editAdmin', 'deleteAdmin', 'createUsers', 'EditUsers');

module.exports = authorizor;