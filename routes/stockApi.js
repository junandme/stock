var express = require('express');
var router = express.Router();

const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");
const dbContext = require("../data/databaseContext");

const newItem = {
  id: "2",
  ticker: "TSLA",
  name: "Cosmos DB",
  description: "Complete Cosmos DB Node.js Quickstart ⚡",
  isComplete: false
};

router.get('/', function (req, res, next) {
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });
  
    const database = client.database(databaseId);
    const container = database.container(containerId); 
  
    stockApi = select(container);
  
    console.log(stockApi);

    res.send(stockApi)
});


async function select(container) {
    // query to return all items
    const querySpec = {
        query: "SELECT * from c"
    };

    try {
        const {resources: items} = await container
            .items
            .query(querySpec)
            .fetchAll();
        return items;
    } catch (err) {
        console.log(err);
    }
}

async function update(createdItem) {
    const {id, category} = createdItem;

    createdItem.isComplete = true;

    const {resource: updatedItem} = await container
        .item(id, category)
        .replace(createdItem);
}


module.exports = router;