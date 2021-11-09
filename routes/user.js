const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
// Import des models
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/user/signup", async (req, res) => {
  try {
    // Vérifier que l'email reçu n'existe pas déjà dans la BDD
    const user = await User.findOne({ email: req.fields.email });
    if (!user) {
      // S'il n'existe pas => inscription
      // Encrypter le mot de passe
      const salt = uid2(16);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const token = uid2(64);
      // Créer un nouveau user
      const newUser = new User({
        pseudo: req.fields.pseudo,
        email: req.fields.email,
        token: token,
        hash: hash,
        salt: salt,
      });

      await newUser.save();
      // Répondre au client
      res.status(200).json({
          pseudo: newUser.pseudo,
        email: newUser.email,
        token: newUser.token,
      });
    } else {
      // Sinon ==> erreur
      res.status(409).json({ message: "This email already has an account." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // Chercher le user qui veut se connecter
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      // Créer un nouveau hash avec le mot de passe rentré à la connexion
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      // Si le hash de la BDD et le nouveau hash sont égaux ==> connexion OK
      if (newHash === user.hash) {
        res.status(200).json({
          email: user.email,
          token: user.token,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }

    // Sinon ==> Unauthorized
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/user/update/favorites-heroes/:id', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {$addToSet:{ favoritesHeroes: req.fields.heroId }},
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) => {
                if(!err) return res.send(docs);
                if(err) return res.status(500).send("Update-user-error " + err);
            }
        )
    } catch (err) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
