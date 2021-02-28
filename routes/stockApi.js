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

router.get('/', async function (req, res, next) {
    const container = getContainer();
  
    stockApi = await select(container);
  
    console.log(stockApi);

    res.send(stockApi);
});

router.put('/order', function(req, res, next){
    const container = getContainer();

    console.log(req.body);

    insert(container, req.body);
}) 

function getContainer(){
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });
  
    const database = client.database(databaseId);

    return database.container(containerId);
}


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

async function update(container, createdItem) {
    const {id, category} = createdItem;

    createdItem.isComplete = true;

    const {resource: updatedItem} = await container
        .item(id, category)
        .replace(createdItem);
}

async function insert(container, item) {
    const { resource: createdItem } = await container.items.create(item);
}

module.exports = router;