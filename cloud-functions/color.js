var admin = require("firebase-admin");

var serviceAccount = require("./neti-v2-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://neti-v2.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("color");

/**
 * Assists with manipulating colors in the database.
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
 * Updates/creates a color type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function update(req, res) {
  const hex = req.body.hex ?
    req.body.hex.replace("#", "").toLowerCase() : null;
  const name = req.body.name ? req.body.name : null;

  regex = /[0-9A-Fa-f]{6}/g;

  if(regex.test(hex) && name.replace(/\s/g, "").length > 0) {
    object = {};
    object[hex] = name;
    ref.update(object).then(function() {
      res.status(200).end();
    }).catch(function(err) {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send('Both a hexidecimal color and a name must be provided.');
  }
}

/**
 * Deletes a color type.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
function delete(req, res) {
  if(req.body.hex) {
    const hex = req.body.hex.toLowerCase();

    db.ref("drugs").on("value", function(snapshot) {
      for (var drug in drugs) {
        if (drugs.hasOwnProperty(drug)) {
          for (var appearance in drug.appearances) {
            if (appearances.hasOwnProperty(appearance)) {
              if(appearance.color_id == hex) {
                res.status(403).send("Drugs are still dependent on this color.");
              }
            }
          }
        } else {
          ref.child(hex).remove().then(function() {
            res.status(200).end();
          }).catch(function(err) {
            res.status(500).send(err);
          });
        }
      }
    });
  } else {
    res.status(400).send("No hex code provided");
  }
}


// var req = {
//   body: {
//     hex:"#2ba4fc",
//     name: "Random color",
//   }
// };
