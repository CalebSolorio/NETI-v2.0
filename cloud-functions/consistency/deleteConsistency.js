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
 *  Assists with deleting a consistency type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  if(event.id) {
    const id = event.id.toLowerCase();
    db.ref("drug").on("value", function(drugs) {
      console.log("drugs", JSON.stringify(drugs.val()));

      const size = Object.keys(drugs.val()).length;
      if(size > 0) {
        var count = 1;

        for(var drug in drugs.val()) {
          const appearances = drugs.val()[drug].appearances;

          for(var appearance in appearances) {
            if(appearances[appearance].consistency_id == id) {
              var response = {
                  status: 403,
                  message: "Drugs are still dependent on this consistency."
              };
              context.fail(JSON.stringify(response));
            }
          }

          if(++count == size) {
            remove(id, context);
          }
        }
      } else {
        remove(id, context);
      }
    });
  } else {
    var response = {
        status: 400,
        message: "No id provided."
    };
    context.fail(JSON.stringify(response));
  }
};

/**
 *  Deletes a consistency type.
 *
 * @param {String} id The id of the consistency type.
 * @param {Object} context Lambda function response context.
 */
function remove(id, context) {
  ref.child(id).remove().then(function() {
    var response = {
        status: 200,
        message: "Consistency" + id + "' successfully removed."
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
