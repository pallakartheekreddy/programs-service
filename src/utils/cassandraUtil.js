var expressCassandra = require('express-cassandra');
var _ = require('lodash');
var schema = require('./../models/cassandra/program_serviceModel')


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
