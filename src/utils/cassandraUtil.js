var expressCassandra = require('express-cassandra');
var _ = require('lodash');
var schema = require('./../models/cassandra/program_serviceModel')

var connection = {}
function createDb(){
    validateSchema(schema);
    var models = expressCassandra.createClient({
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: {
                port: 9042
            },
            keyspace: schema.keyspace_name,
            queryOptions: {
                consistency: expressCassandra.consistencies.one
            }
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe',
        }
    });

    _.forEach(schema.column_families, (tabledata) => {
        var MyModel = models.loadSchema(tabledata.table_name, {
            fields: tabledata.fields,
            key: tabledata.key
        })
        MyModel.syncDB(function(err, result) {
            if (err) throw err;
            if (result) {
                console.log(`cassandra schema updated successfully for "${tabledata.table_name}"`);
            } else {
                console.log(`no Cassandra schema change detected for plugin "${tabledata.table_name}"!`);
            }
        });
        connection[schema.keyspace_name] = models
    })
}

function getConnections (keyspace) {
    return connection[keyspace]
}

function checkCassandraDBHealth (callback) {
    const client = new cassandraDriver.Client({ contactPoints: contactPoints })
    client.connect()
      .then(function () {
        client.shutdown()
        callback(null, true)
      })
      .catch(function (err) {
        console.log('cassandra err:', err)
        client.shutdown()
        callback(err, false)
      })
}

function validateSchema(schema) {
    console.log(schema)
    if (!schema.column_families || !Array.isArray(schema.column_families)) {
        console.error('invalid cassandra schema! "column_families" not defined!');
    }
    if (!schema.keyspace_name) {
        console.error('invalid cassandra schema! "keyspace_name" not defined!')
    }
}
createDb();

module.exports = { getConnections, checkCassandraDBHealth }
