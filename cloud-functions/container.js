var admin = require("firebase-admin");
var uuid = require("uuid");

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("container");

/**
 *  Assists with manipulating containers in the database.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.color = function container (req, res) {
  if(req.method == 'POST' || req.method == 'PUT') {
    update(req, res);
  } else if(req.method = 'DELETE') {
    delete(req, res);
  } else {
    res.status(400).send("Bad request.");
  }
};

/**
 * Updates/creates a container type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function update(req, res) {
  if(req.body.name.replace(/\s/g, "").length > 0) {
    object = {};
    object[req.body.id ? req.body.id : uuid.v1()] = {
      name: req.body.name,
      description: req.body.description,
    };
    ref.update(object).then(function() {
      res.status(200).end();
    }).catch(function(err) {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send('The name of the container must be provided.');
  }
}

/**
 * Deletes a container type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function delete(req, res) {
  if(req.body.id) {
    const id = req.body.id;

    db.ref("drugs").on("value", function(snapshot) {
      for (var drug in drugs) {
        if (drugs.hasOwnProperty(drug)) {
          for (var appearance in drug.appearances) {
            if (appearances.hasOwnProperty(appearance)) {
              if(appearance.consistency_id == id) {
                res.status(403)
                  .send("Drugs are still dependent on this container type.");
              }
            }
          }
        } else {
          ref.child(id).remove().then(function() {
            res.status(200).end();
          }).catch(function(err) {
            res.status(500).send(err);
          });
        }
      }
    });
  } else {
    res.status(400).send("No id provided");
  }
}

// var req = {
//   body: {
//     id: "35155a70-1fab-11e7-a9c7-db6ec2b89610",
//     description:"#2ba4fc",
//     name: "Random container",
//   }
// };
