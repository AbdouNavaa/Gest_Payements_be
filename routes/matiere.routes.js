const express = require('express');
const app = express();

const router = express.Router();
let Matiere = require('../model/matiere');
const Type = require('../model/Type');

// Add Book
router.route('/add-matiere').post( (req, res, next) => {
    const mat = new Matiere({
        name: req.body.name,
        coef: req.body.coef,
        taux: req.body.taux,
    });
    mat.save().then(
        () => {
            res.status(201).json({
                message: 'Matiere saved successfully!'
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

// Get all Book
router.route('/').get((req, res) => {
    Matiere.find().populate('taux').then(
        (matieres) => {
            res.status(200).json(matieres);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
})

// Get Book
router.route('/read-matiere/:id').get((req, res) => {
    Matiere.findOne({
        _id: req.params.id
    }).populate('taux','name').then(
        (matiere) => {
            res.status(200).json(matiere);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
})
// Update Book
router.put('/update-matiere/:id',(req, res, next) => {
    Type.findOne({_id: req.body.taux}).then(
        (type) => {
            if (!type) {
                throw new Error("Invalid 'taux' field value");
            }
            const mat = new Matiere({
                _id: req.params.id,
                name: req.body.name,
                coef: req.body.coef,
                taux: type._id,
            });
            return Matiere.updateOne({_id: req.params.id}, mat);
        }
    ).then(
        () => {
            res.status(201).json({
                message: 'Matiere updated successfully!'
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


// Delete Book
router.route('/delete-matiere/:id').delete((req, res, next) => {
    Matiere.deleteOne({_id: req.params.id}).then(
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
