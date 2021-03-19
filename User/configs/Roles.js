var Permissions = require("./Permissions");

module.exports = {
    admin: [].concat(Permissions.read, Permissions.write),
    superAdmin: [].concat(Permissions.superAdmin),
    teller: [].concat(Permissions.read)
}
