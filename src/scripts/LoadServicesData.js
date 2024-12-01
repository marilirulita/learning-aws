var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "us-east-1"
});

console.log("Writing entries to Services table.");

var dynamodb = new AWS.DynamoDB.DocumentClient();
var servicesData = 
  JSON.parse(fs.readFileSync('../components/data/services.json', 'utf8'));

servicesData.forEach(function(services) {
  var params = {
    TableName: "Services",
    Item: {
      "name": services.name
    }
  };

  dynamodb.put(params, function(err, data) {
    if (err)
      console.error("Unable to load data into table for services",
                    services.name, ". Error: ", JSON.stringify(err, null, 2))
    else
      console.log("Added", services.name, "to table.")
  })
});