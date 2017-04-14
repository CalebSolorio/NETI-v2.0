var admin = require("firebase-admin");

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("color");

/**
 * Assists with deleting a color type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  if(event.hex) {
    const hex = event.hex.toLowerCase();
    db.ref("drug").on("value", function(drugs) {
      console.log("drugs", JSON.stringify(drugs.val()));

      const size = Object.keys(drugs.val()).length;
      if(size > 0) {
        var count = 1;

        for(var drug in drugs.val()) {
          const appearances = drugs.val()[drug].appearances;

          for(var appearance in appearances) {
            if(appearances[appearance].color_id == hex) {
              var response = {
                  status: 403,
                  message: "Drugs are still dependent on this color."
              };
              context.fail(JSON.stringify(response));
            }
          }

          if(++count == size) {
            remove(hex, context);
          }
        }
      } else {
        remove(hex, context);
      }
    });
  } else {
    var response = {
        status: 400,
        message: "No hex code provided."
    };
    context.fail(JSON.stringify(response));
  }
};

/**
 *  Deletes a color type.
 *
 * @param {String} hex The hex code of the color type.
 * @param {Object} context Lambda function response context.
 */
function remove(hex, context) {
  ref.child(hex).remove().then(function() {
    var response = {
        status: 200,
        message: "Color '#" + hex + "' successfully removed."
    };
    context.succeed(response);
  }).catch(function(err) {
    var response = {
        status: 500,
        message: "Whoops! Something dun borked on our end ¯\_(ツ)_/¯"
    };
    context.fail(JSON.stringify(response));
  });
}
