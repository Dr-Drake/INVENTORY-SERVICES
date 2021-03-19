var {client} = require("../mongo_config");
var {Query, QueryError} = require("../utils/Query");
var UserSchema = require("../models/UserSchema");
var OwnerSchema = require("../models/OwnerSchema");

async function deleteDatabase(req, res){
    var inv;
    console.log(req.query)

    if (req.params.inventory){
        inv = req.params.inventory.toLowerCase()
    }

    if (req.query.inventory){
        inv = req.query.inventory.toLowerCase()
    }

    //var inv = req.params.inventory.toLowerCase()  // Should be in lowercase
    var db = client.db(inv)  // The database

    try{

        var userQuery = new Query(client, "myadmin", "users", UserSchema);
        var ownerQuery = new Query(client, "myadmin", "owners", OwnerSchema);

        // Drop the database
        var dropResult = await db.dropDatabase()

        if (dropResult){

            // Delete users connected to inventory
            var deletefilter = {inventory: {$eq: inv}};
            var deleteResult = await userQuery.delete(deletefilter);

            // Delete the owner's profile afterwards
            if (deleteResult){
                var ownerDeletionResult = await ownerQuery.delete(deletefilter);

                if (ownerDeletionResult){
                    res.json({
                        message: "success",
                        result: ownerDeletionResult.result,
                        owner: req.token.name
                    })
                    return
                }
            }
        }

    }catch(err){
        // We're not expecting any error
        console.log(err);
        console.log("Error occurred while deleteing database");
        res.status(500);
        res.send("An internal server error occured");
    }

}

module.exports = deleteDatabase;