// This file exposes the REST API endpoints and performs their business logic against the Atlas cluster

const express = require('express');

// recordRoutes is an instance of the express router
// We use it to define our routes.
// The router will be added as a midware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// READ route
// This section will help you get a list of all the documents
recordRoutes.route('/listings').get(async (_req, res) => {
    const dbConnect = dbo.getDb();
    // this code sends back the result set as the API response
    dbConnect
        .collection('listingsAndReviews')
        .find({})
        .limit(50)
        .toArray((err, result) => {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
});

// CREATE route
// This section will help you create a new document
recordRoutes.route('/listings/recordSwipe').post((req, res) => {
    const dbConnect = dbo.getDb();
    const matchDocument = {
        listing_id: req.body.id,
        last_modified: new Date(),
        session_id: req.body.session_id,
        direction: req.body.direction
    };
    dbConnect
        .collection('matches')
        .insertOne(matchDocument, (err, result) => {
            if (err) {
                res.status(400).send('Error inserting matches!');
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                res.status(204).send();
            }
        });
}); // The save is done via collection.insertOne() method with the prebuilt 'matchDocument'
    // you can also use insertMany to insert multiple documents at once.

// UPDATE route
// This section will help you update a document by id
recordRoutes.route('/listings/updateLike').post((req, res) => {
    const dbConnect = dbo.getDb();
    const listingQuery = { _id: req.body.id };
    const updates = {
        $inc: {
            likes: 1
        }
    };
    dbConnect
        .collection('listingsAndReviews')
        .updateOne(listingQuery, updates, (err, _result) => {
            if (err) {
                res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                console.log('1 document updated');
            }
        });
}); // The method will use the collection.updateOne() method with $inc on the 'like' field to increment the likes

// DELETE route
// Whenever a listing is dropped, we can delete it from the database so that it doesn't appear anymore.
// This section will help you delete a record
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
    const dbConnect = dbo.getDb();
    const listingQuery = { listing_id: req.body.id };

    dbConnect
        .collection('listingsAndReviews')
        .deleteOne(listingQuery, function (err, _result) {
            if (err) {
                res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
            } else {
                console.log('1 document deleted')
            }
        })
})

module.exports = recordRoutes;
