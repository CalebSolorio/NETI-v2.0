var admin = require("firebase-admin");

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("color");

/**
 * Updates/creates a color type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  const hex = event.hex ?
    event.hex.replace("#", "").toLowerCase() : null;
  const name = event.name ? event.name : null;

  const regex = /[0-9A-Fa-f]{6}/g;

  if(hex && name && regex.test(hex) && name.replace(/\s/g, "").length > 0) {
    var object = {};
    object[hex] = name;
    ref.update(object).then(function() {
      const response = {
          status: 200,
          message: "Manipulation on color '#" + hex + "' successful."
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
        message: "Both a hexidecimal color and a name must be provided."
    };
    context.fail(JSON.stringify(response));
  }
};
