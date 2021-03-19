const {createDatabase, DatabaseCreationError} = require("../utils/createDatabase")
const OwnerSchema = require("../models/OwnerSchema");
const {Query, QueryError} = require("../utils/Query");
const {client} = require("../mongo_config");
const {ValidationError} = require("joi")

async function createInventory(req, res){

    // Check if inventory in payload
    if (!req.body.inventory){
        res.status(400)
        res.json({
            error: 400,
            message: "Inventory name is required"
        })
        return
    }

    // Make sure the value is a string
    if(typeof req.body.inventory !== 'string'){
        res.status(400)
        res.json({
            error: 400,
            message: "The inventory parameter should be of type string"
        })
        return
    }
    console.log(req.token.role)
    // Check role
    if (req.token.role.toLowerCase() !== "superadmin"){
        res.status(403),
        res.json({
            error: 403,
            message: "Forbiddern action"
        })
        return;
    }


    // Begin operations

    try{
        
        // See if user has inventory
        var ownerQuery = new Query(client, "myadmin", "owners", OwnerSchema);
        const result = await ownerQuery.read({_id: req.token.user})

        // If so, let them know
        if (result.length > 0){
            res.status(400);
            res.json({
                error: 400,
                messgae: "User already has inventory"
            })

            return;
        }

        // Check if inventory name is valid
        var taken = ["admin", "local", "config", "myadmin"]
        var inv = req.body.inventory.toLowerCase();
        if (taken.includes(inv)){
            res.status(400);
            res.json({
                error: 400,
                messgae: "This inventory name is not permitted"
            })

            return;
        }

        // Check if invetory name is in use
        const result2 = await ownerQuery.read({inventory: req.body.inventory.toLowerCase()})
        if (result2.length > 0){
            res.status(400);
            res.json({
                error: 400,
                messgae: "Inventory name is already in use"
            })

            return;
        }
        

        // Create database
        const status = await createDatabase(req.body.inventory.toLowerCase())

        // If successfull, create the owner in the admin database
        if (status.task){
            console.log(`Database ${req.body.inventory} has been created`)
            var document = {
                _id: req.token.user,
                name: req.token.name,
                inventory: req.body.inventory.toLowerCase()
            }
            var ownerResult = await ownerQuery.create([document])

            if (ownerResult){
                console.log(`Owner: ${req.token.name} has been created`)
                res.json({
                    owner: req.token.name,
                    message: "success"
                });
                return
            }

        }
    }catch(err){
        // Error from createDatabase
        if (err instanceof DatabaseCreationError){
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // Error from schema validation
        if (err instanceof ValidationError){
            res.status(400);
            res.json({
                error: 400,
                message: err.message
            })
            return
        }

        // We are not expecting any other error so...
        console.log("Error occured while creating inventory")
        console.log(err)
        res.status(500);
        res.send("An internal server error occured.")

    }

        

}

module.exports = createInventory;