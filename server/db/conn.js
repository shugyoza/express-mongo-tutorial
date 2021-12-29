// this file exposes a global connection to the Atlas database by exporting a MongoDB client that any other module can use

const { MongoClient } = require('mongodb');
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

/* The main object this module exports out is the _db variable which will hold the 'sample_airbnb'
database-level object. Via this object, we will be able to access any collection within that database
or change its context to another database. In this tutorial we will use only a single database
named 'sample_airbnb */

module.exports = {
    connectToServer: (callback) => {
        client.connect((err, db) => {
            if (err || !db) {
                return callback(err);
            }

            dbConnection = db.db('sample_airbnb');
            console.log('Successfully connected to MongoDB.');

            return callback();
        });
    },

    getDB: () => dbConnection
}
