var express = require('express');
var router = express.Router();

const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");
const dbContext = require("../data/databaseContext");

router.get('/', async function (req, res, next) {
    const container = getContainer();

    var name = 'jun';

    myStocks = await getMyStocks(container, name);
    myAccount = await getMyAccount(container, name);
    myInfo = await getMyInfo(container, name);

    data = [myStocks, myAccount, myInfo];

    res.send(data);
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


async function getMyStocks(container, name) {
    // query to return all items
    const querySpec = {
        query: "SELECT * from c where (c.category = 'buy' or c.category = 'sell') and c.user = '"+name+"'"
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
async function getMyAccount(container, name) {
    // query to return all items
    const querySpec = {
        query: "SELECT * from c where (c.category = 'deposit' or c.category = 'withdraw' or c.category = 'dividend' or c.category = 'interest') and c.user = '"+name+"'"
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
async function getMyInfo(container, name) {
    // query to return all items
    const querySpec = {
        query: "SELECT * from c where (c.category = 'fees' or c.category = 'stockData') and c.user = '"+name+"'"
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