// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('messages').add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });
  


exports.getNearbyPlaces = functions.https.
    onCall(async (data, context) => {
        // test
        const lat = data.latitude;
        const long = data.longitude;
        const apiKey = "AIzaSyBGiyH12S9SDH7Pn9AdFbRRvYG8WF4DCy0";  // TODO: delete
        var radius = data.radius; // optional
        const keyword = data.keyword; // optional

        /* API call manipulation */
        /* Note: name is deprecated and appends itself onto keyword field */
        var link = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}location=${lat}%2C${long}&name=Skatepark`;
        if (radius == undefined) {
            radius = 5000;  // Default
            functions.logger.log(`Default radius used`);
        }
        link += '&radius=' + radius;

        if (keyword == undefined) {
            functions.logger.log('No keyword passed');
        }
        else {
            link += '&keyword=' + keyword;
        }


        var config = {
            method: 'get',
            url: link,
            headers: { }
        };
        
        // const promise = axios(config);
        // const dataPromise = promise.then((response) => response.data);
        // return dataPromise;
        return axios(config).then((response) => response.data);
    });

/**
 * Returns image file from Place's photo reference
 */
exports.getPlacePhoto = functions.https.
    onCall(async (data, context) => {
                // test

        const photo_reference = data.photo_reference;
        const maxwidth = data.maxwidth;
        const key = "AIzaSyBGiyH12S9SDH7Pn9AdFbRRvYG8WF4DCy0";
        var link = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photo_reference}&key=${key}`;
        var config = {
            method: 'get',
            url: link,
            headers: {}
        };

        const promise = axios(config);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    });


/**
 * NOT IN USE
 * use as reference only
 */
/*
exports.getGoogleTextSearchOnCreate = functions.firestore.document('/SearchQuery/{documentId}')
    .onCreate((snap, context) => {
        // const lat = snap.data().latitude;
        // const long = snap.data().longitude;
        // const radius = 1500;
        const query = snap.data().query;
        const key = "";
        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${key}`,
            headers: {}
        };

        return axios(config)
            .then(response => {
                const places = JSON.stringify(response.data);
                console.log(places);
                functions.logger.log('Places', context.params.documentId, places);
                return snap.ref.set({ searchResult }, { merge: true });
            })
            .catch(error => {
                console.log(error);
                return callback(new Error("Error getting google search"))
            });
    });
*/

/**
 * Good way to search for "Skateparks near me" with a location + radius parameter!!
 *  --> Use for general map population around the user
 * https://developers.google.com/maps/documentation/places/web-service/search-text
 */
exports.getGoogleTextSearchOnCall = functions.https.
    onCall(async (data, context) => {
                // test

        const lat = data.latitude;
        const long = data.longitude;
        const radius = 2000;        // Note: radius is not always respected

        const key = "AIzaSyBGiyH12S9SDH7Pn9AdFbRRvYG8WF4DCy0";
        const query = [skate, parks, near, me].join('%20');

        var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=skatepark&location=${latitude}%2C${longitude}&radius=${radius}&key=${key}`,
            headers: {}
        };

        const promise = axios(config);
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    });
