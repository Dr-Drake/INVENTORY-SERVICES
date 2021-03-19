
module.exports = {
    "read":["readUsers", "readProducts", "readBranches", "readTerminals", "readCategories", "readPurchases"],
    "write": ["createUsers", "updateUsers",
    "createProducts","updateProducts", 
    "createBranches", "updateBranches",
    "createTerminals", "updateTerminals",
    "createCategories", "updateCategories"],

    "execute": ["deleteProducts", "deleteCategories", "deleteTerminals", "deleteUsers"],
    "superAdmin": ["ALL"]
}