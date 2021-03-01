var express = require('express');
var router = express.Router();

const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");
const dbContext = require("../data/databaseContext");

router.get('/', async function (req, res, next) {
    const container = getContainer();

    console.log(req.query)

    var name = req.query.name;

    myStocks = await getMyStocks(container, name);
    myAccount = await getMyAccount(container, name);
    myInfo = await getMyInfo(container, name);

    data = [myStocks, myAccount, myInfo];

    res.send(data);
});

router.put('/order', function(req, res, next){
    const container = getContainer();

    console.log(req.body);

    switch(req.body.category){
        case 'buy':
            onBuyUpdateStockData(container, req.body);
            break;
        case 'sell':
            onSellUpdateStockData(container, req.body);
            break;
        case 'deposit':
        case 'withdraw':
        case 'dividend':
        case 'interest':
            updateAccountData(container, req.body.name, req.body.price, req.body.category);
            break;
    }

    // insert log data
    insert(container, req.body);
}) 

async function updateAccountData(container, name, price, category){
    var myAccounts = await getMyAccount(container, name);

    if(myAccounts.length == 0 && category != 'withdraw' && category != 'buy'){
        var newItem = {
            category : 'account',
            name : name,            
            price : price,
            fees : 0.00            
        };

        insert(container, newItem);
        return;
    }

    var myAccount = myAccounts[0];

    if(category === 'withdraw' || category === 'buy'){
        myAccount.price = parseFloat(myAccount.price) - parseFloat(price);
    } else {
        myAccount.price = parseFloat(myAccount.price) + parseFloat(price);
    }

    update(container, myAccount);
}

async function onSellUpdateStockData(container, item){
    var myStockInfos = await getMyStockInfo(container, item.name, item.ticker);
    var myStockInfo = myStockInfos[0];

    myStockInfo.amount = parseInt(myStockInfo.amount) - parseInt(item.amount);

    update(container, myStockInfo);
    updateAccountData(container, item.name, parseInt(item.amount) * parseFloat(item.price), item.category);
}

async function onBuyUpdateStockData(container, item){
    var myStockInfos = await getMyStockInfo(container, item.name, item.ticker);

    if(myStockInfos.length == 0){
        var newItem = {
            category : 'stockData',
            name : item.name,
            ticker : item.ticker,
            price : item.price,
            amount : item.amount,
            weightTarget : 0,
            description : ''
        };

        insert(container, newItem);
        return;
    }

    var myStockInfo = myStockInfos[0];
    
    if (myStockInfo.amount == 0) {
        myStockInfo.price = parseFloat(item.price);
        myStockInfo.amount = parseInt(item.amount);
    } else {
        let sumAmount = parseInt(myStockInfo.amount) + parseInt(item.amount);
        let beforTotalPrice = parseFloat(myStockInfo.price) * parseFloat(myStockInfo.amount);
        let newTotalPrice = parseFloat(item.price) * parseFloat(item.amount);

        myStockInfo.price = (beforTotalPrice + newTotalPrice) / sumAmount;
        myStockInfo.amount = sumAmount;
    }

    update(container, myStockInfo);
    updateAccountData(container, item.name, parseInt(item.amount) * parseFloat(item.price), item.category)
}

function getContainer(){
    const { endpoint, key, databaseId, containerId } = config;

    const client = new CosmosClient({ endpoint, key });
  
    const database = client.database(databaseId);

    return database.container(containerId);
}


async function getMyStocks(container, name) {
    const querySpec = {
        query: "SELECT * from c where (c.category = 'buy' or c.category = 'sell') and c.name = '"+name+"'"
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
    const querySpec = {
        query: "SELECT * from c where c.category = 'account' and c.name = '"+name+"'"
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
    const querySpec = {
        query: "SELECT * from c where (c.category = 'fees' or c.category = 'stockData') and c.name = '"+name+"'"
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

async function getMyStockInfo(container, name, ticker) {
    const querySpec = {
        query: "SELECT * from c where c.category = 'stockData' and c.name = '"+name+"' and c.ticker ='"+ticker+"'"
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