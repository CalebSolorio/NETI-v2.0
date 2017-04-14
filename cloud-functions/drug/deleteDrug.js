var admin = require("firebase-admin");
var uuid = require("uuid");
var async = require('async');
var _ = require('underscore');

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("drug");

/**
 * Deletes a drug type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  const id = event.id;
  if(id) {
    ref.child(id).remove().then(function() {
      const response = {
          status: 200,
          message: "Successfully deleted drug " + id + "."
      };
      context.succeed(response);
    }).catch(function(err) {
      const response = {
          status: 500,
          message: "Whoops! Something dun borked on our end ¯\_(ツ)_/¯"
      };
      context.fail(JSON.stringify(response));
    });
  } else {
    const response = {
        status: 500,
        message: "No id provided."
    };
    context.fail(JSON.stringify(response));
  }
};
