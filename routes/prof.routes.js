const express = require('express');
const app = express();

const router = express.Router();
let Prof = require('../model/Prof');

// Add Preof
router.route('/add-prof').post( (req, res, next) => {
    const prof = new Prof({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
        Banque: req.body.Banque,
        Compte: req.body.Compte,
    });
    prof.save().then(
        () => {
            res.status(201).json({
                message: 'Teacher saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});

// Get all Preof
router.route('/').get((req, res) => {
    Prof.find().then(
        (profs) => {
            res.status(200).json(profs);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
})

// Get Preof
router.route('/read-prof/:id').get((req, res) => {
    Prof.findOne({
        _id: req.params.id
    }).then(
        (prof) => {
            res.status(200).json(prof);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
})


// Update Preof
router.route('/update-prof/:id').put((req, res, next) => {
    const prof = new Prof({
        _id: req.params.id,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
        Banque: req.body.Banque,
        Compte: req.body.Compte,
    });
    Prof.updateOne({_id: req.params.id}, prof).then(
        () => {
            res.status(201).json({
                message: 'Teacher updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
})

// Delete Preof
router.route('/delete-prof/:id').delete((req, res, next) => {
    Prof.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
})

module.exports = router;
