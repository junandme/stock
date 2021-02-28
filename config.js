// @ts-check

const config = {
    endpoint: "https://stooock.documents.azure.com:443/",
    key: "EhpAGM61pOjAsslZM5tBqpWmM8FFjc2wy6eRf9qCBgDushYFstZvW3ETjxV9oDVcKRUkWX8ZlM5IF6FrpCqjew==",
    databaseId: "StockDB",
    containerId: "stock",
    partitionKey: { kind: "Hash", paths: ["/ticker"] }
  };
  
  module.exports = config;