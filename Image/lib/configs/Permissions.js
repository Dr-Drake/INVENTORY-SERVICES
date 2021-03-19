
module.exports = {
    "read":["readUsers", "readProducts", 
    "readBranches", "readTerminals", 
    "readCategories", "readPurchases",
    "readImages"],

    "write": ["createUsers", "updateUsers",
    "createProducts","updateProducts", 
    "createBranches", "updateBranches",
    "createTerminals", "updateTerminals",
    "createCategories", "updateCategories",
    "createImages", "updateImages"],

    "execute": ["deleteProducts", "deleteCategories", 
    "deleteTerminals", "deleteUsers", "deleteBranches",
    "deleteImages"],
    
    "superAdmin": ["ALL"]
}