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
 * Assists with manipulating drugs in the database.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.color = function drug (req, res) {
  if(req.method == 'POST' || req.method == 'PUT') {
    update(req, res);
  } else if(req.method = 'DELETE') {
    delete(req, res);
  } else {
    res.status(400).send("Bad request.");
  }
};

/**
 * Updates/creates a drug type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function update(req, res) {
  async.waterfall([
    function(wNext) {
      if(req.body.appearances) {
        req.body.appearances = {
          arr: req.body.appearances,
        };
        for(var i = 0; i < req.body.appearances.arr.length; i ++)(function(i) {
          var appearance = req.body.appearances.arr[i];
          async.parallel([
            function(pNext) {
              var colorRef = db.ref("color");
              colorRef.child(appearance.color_id.toLowerCase())
                  .on("value", function(snapshot) {
                if(snapshot.val() === undefined) {
                  pNext("Field 'color_id' not valid.");
                }
                pNext(null);
              });
            }, function(pNext) {
              var consistencyRef = db.ref("consistency");
              consistencyRef.child(appearance.consistency_id)
                  .on("value", function(snapshot) {
                if(snapshot.val() === undefined) {
                  pNext("Field 'consistency_id' not valid.");
                }
                pNext(null);
              });
            }, function(pNext) {
              var containerRef = db.ref("container");
              containerRef.child(appearance.container_id)
                  .on("value", function(snapshot) {
                if(snapshot.val() === undefined) {
                  pNext("Field 'container_id' not valid.");
                }
                pNext(null);
              });
            }
          ], function(err) {
            if(err) {
                console.log("81 " + err);
              res.status(400).send(err);
            } else {
              req.body.appearances[appearance.id ?appearance.id : uuid.v1()] =
                _.pick(appearance, "color_id", "consistency_id", "container_id");
              if(i + 1 == req.body.appearances.arr.length) {
                delete req.body.appearances.arr;
                wNext(null);
              }
            }
          });
        }(i));
      } else {
        wNext(null);
      }
    }, function(wNext) {
      if(req.body.name.replace(/\s/g, "").length > 0) {
        var id = req.body.id ? req.body.id : uuid.v1();
        object = {};
        object[id] = {
          name: req.body.name,
          description: req.body.description
        };

        ref.update(object).then(function() {
          if(!req.body.appearances) {
            wNext(200, null);
          }

          var appearances = req.body.appearances;

          for (var appearance in appearances) {
            if (appearances.hasOwnProperty(appearance)) {
              ref.child(id + "/appearances/" + appearance)
                  .update(appearances[appearance]).catch(function(err) {
                wNext(500, err);
              });
            } else {
              wNext(200, null);
            }
          }
        }).catch(function(err) {
          wNext(500, err);
        });
      } else {
        wNext(400, "The name of the consistency must be provided.");
      }
    }
  ], function(status, err) {
    console.log(err);
    res.status(status).send(err);
  });
}

/**
 * Deletes a drug type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function deleteDrug(req, res) {
  id = req.body.id;
  if(id) {
    ref.child(id).remove().then(function() {
      res.status(200).end();
    }).catch(function(err) {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send("No id provided");
  }
}

// var req = {
//   body: {
//     id: "56d48680-1fc0-11e7-84b9-7786a0654a0e",
//     description:"this is random, but supes dangerous",
//     name: "Random drug",
//     appearances: [
//       {
//         id: "56d48680-1fc0-11e7-84b9-7786a0654a0e",
//         color_id: "2ba4fc",
//         consistency_id: "35155a70-1fab-11e7-a9c7-db6ec2b89610",
//         container_id: "35155a70-1fab-11e7-a9c7-db6ec2b89610",
//       },
//       {
//         id: "66d48680-1fc0-11e7-84b9-7786a0654a0e",
//         color_id: "2ba4fc",
//         consistency_id: "35155a70-1fab-11e7-a9c7-db6ec2b89610",
//         container_id: "35155a70-1fab-11e7-a9c7-db6ec2b89610",
//         lol: "wat"
//       },
//     ],
//   }
// };


// ref.child("lol").on("value", function(snapshot) {
//   console.log(snapshot.val());
//   console.log(snapshot.getKey())
// });
