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
 * Updates/creates a drug type.
 *
 * @param {Object} event Lambda function request.
 * @param {Object} context Lambda function response context.
 */
exports.handler = function (event, context) {
  async.waterfall([
    function(wNext) {
      if(event.appearances) {
        event.appearances = {
          arr: event.appearances,
        };

        const length = event.appearances.arr.length;
        for(var i = 0; i < length; i++)(function(i) {
          const appearance = _.pick(event.appearances.arr[i],
            "color_id", "consistency_id", "container_id");
          for(var j = 0; j < i; j++) {
            const other = _.pick(event.appearances.arr[j],
              "color_id", "consistency_id", "container_id");

            if(appearance.color_id && appearance.consistency_id &&
                  appearance.container_id && other.color_id &&
                  other.consistency_id && other.container_id &&
                  appearance.color_id == other.color_id &&
                  appearance.consistency_id == other.consistency_id &&
                  appearance.container_id == other.container_id) {
              wNext({ status: 400,
                message: "Duplicate appearances provided." });
            }
          }

          if(appearance.color_id && appearance.consistency_id &&
              appearance.container_id) {
            async.parallel([
              function(pNext) {
                db.ref("color").child(appearance.color_id.toLowerCase())
                    .on("value", function(snapshot) {
                  if(snapshot.val() === null) {
                    pNext({ status: 400,
                      message: "Field 'color_id' not valid." });
                  }
                  pNext(null);
                });
              }, function(pNext) {
                db.ref("consistency").child(appearance.consistency_id)
                    .on("value", function(snapshot) {
                  if(snapshot.val() === null) {
                    pNext({ status: 400,
                      message: "Field 'consistency_id' not valid." });
                  }
                  pNext(null);
                });
              }, function(pNext) {
                db.ref("container").child(appearance.container_id)
                    .on("value", function(snapshot) {
                  if(snapshot.val() === null) {
                    pNext({ status: 400,
                      message: "Field 'container_id' not valid." });
                  }
                  pNext(null);
                });
              }
            ], function(err) {
              if(err) {
                wNext(err);
              } else {
                event.appearances[appearance.id ?appearance.id : uuid.v1()] =
                  _.pick(appearance, "color_id", "consistency_id", "container_id");
                if(i + 1 == event.appearances.arr.length) {
                  delete event.appearances.arr;
                  wNext(null);
                }
              }
            });
          } else {
            const response = {
              status: 400,
              message: "For each appearance, color_id, consistency_id, " +
                "and container_id must all be provided."
            }
            context.fail(JSON.stringify(response));
          }
        }(i));
      } else {
        wNext(null);
      }
    }, function(wNext) {
      if(event.name && event.description &&
          event.name.replace(/\s/g, "").length > 0 && event.description.length > 0) {
        const id = event.id ? event.id : uuid.v1();
        object = {};
        object[id] = {
          name: event.name,
          description: event.description,
          appearances: event.appearances
        };

        ref.update(object).then(function() {
          wNext(null);
        }).catch(function(err) {
          wNext({ status: 500,
            message:"Oops! Something dun borked on our end ¯\_(ツ)_/¯" });
        });
      } else {
        wNext({ status: 400,
          message: "The name of the consistency must be provided." });
      }
    }
  ], function(err) {
    if(err) {
      context.fail(JSON.stringify(err));
    } else {
      const response = {
        status: 200,
        message: "Drug insertion/manipulation successful."
      }
      context.succeed(response);
    }
  });
};
