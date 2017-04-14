var admin = require("firebase-admin");
var uuid = require("uuid");

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("consistency");

/**
 *  Updates/creates a consistency type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  if(event.name && event.description &&
      event.name.replace(/\s/g, "").length > 0 && event.description.length > 0) {
    var object = {};
    object[event.id ? event.id : uuid.v1()] = {
      name: event.name,
      description: event.description
    };
    ref.update(object).then(function() {
      const response = {
          status: 200,
          message: "Manipulation on consistency '" + event.name + "' successful."
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
        status: 400,
        message: "The name of the consistency must be provided."
    };
    context.fail(JSON.stringify(response));
  }
};
