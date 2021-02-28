var express = require('express');
var router = express.Router();
const request = require('request');

const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");
const dbContext = require("../data/databaseContext");

router.get('/', async function (req, res, next) {
    const container = getContainer();

    var name = req.query.name;

    myAccount = await getMyAccount(container, name);
    myStocks = await getMyStocks(container, name);
    myInfo = await getMyInfo(container, name);

    var data = [ myAccount, myStocks ];
    res.send( data );
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
        query: "SELECT * from c where (c.category = 'buy' or c.category = 'sell') and c.name = '"+name+"' order by c._ts"
    };
    var _stocks = [];

    try {
        const {resources: items} = await container
            .items
            .query(querySpec)
            .fetchAll();
        items.forEach(async item => {
            var existingStock = _stocks.filter(function(element) {
                return element.ticker === item.ticker;
            })
            if(existingStock != "") {
                var index = _stocks.findIndex(function(tem, i) {
                    return tem.ticker === item.ticker
                });
                var beforePrice = parseInt(_stocks[index].price);
                var beforeAmount = parseInt(_stocks[index].amount);
                var nowPrice = parseInt(item.price);
                var nowAmount = parseInt(item.amount);
                if(item.category === "buy") {
                    _stocks[index].amount = beforeAmount + nowAmount;
                    _stocks[index].price = ( (beforePrice*beforeAmount) + (nowPrice*nowAmount) ) / _stocks[index].amount;
                } else if(item.category === "sell") {
                    _stocks[index].amount = beforeAmount - nowAmount;
                    _stocks[index].price = ( (beforePrice*beforeAmount) - (nowPrice*nowAmount) ) / _stocks[index].amount;
                } else { }
            } else {
                var response = await request('https://cloud.iexapis.com/stable/stock/'+item.ticker+'/quote?token=pk_6ee50fde81c24341bdca5f071708c226');
                item.nowPrice = response.latestPrice;
                _stocks.push(item);
            }
        });
        return _stocks;
    } catch (err) {
        console.log(err);
    }
}
async function getMyAccount(container, name) {
    // query to return all items
    const querySpec = {
        query: "SELECT * from c where (c.category = 'deposit' or c.category = 'withdraw' or c.category = 'dividend' or c.category = 'interest') and c.name = '"+name+"'"
    };
    var _myAccount = 0;

    try {
        const {resources: items} = await container
            .items
            .query(querySpec)
            .fetchAll();
        items.forEach(item => {
            if(item.category === "deposit" || item.category === "interest" || item.category === "dividend") {
                _myAccount = parseInt(_myAccount) + parseInt(item.price);
            } else if(item.category === "withdraw") {
                _myAccount = parseInt(_myAccount) - parseInt(item.price);
            } else { }
        });
        return _myAccount;
    } catch (err) {
        console.log(err);
    }
}
async function getMyInfo(container, name) {
    // query to return all items
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