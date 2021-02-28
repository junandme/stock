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

async function select(container){
  // query to return all items
  const querySpec = {
    query: "SELECT * from c"
  };

  try{
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    items.forEach(item => {
      console.log(`${item.id} - ${item.ticker}`);
    });
  } catch (err) {
    console.log(err);
  }

  
}


/* GET home page. */
router.get('/', function(req, res, next) {
  const { endpoint, key, databaseId, containerId } = config;

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId); 

  select(container);

  res.render('index', { title: 'Express' });
});

module.exports = router;
