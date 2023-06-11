const express = require('express');
const app = express();

const router = express.Router();
let Type = require('../model/Type');

// Add Type
router.route('/add-type').post( (req, res, next) => {
    const type = new Type({
        name: req.body.name,
        taux: req.body.taux,
    });
    type.save().then(
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

// Get all Type
router.route('/').get((req, res) => {
    Type.find().then(
        (types) => {
            res.status(200).json(types);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
})

// Get Type
router.route('/read-type/:id').get((req, res) => {
    Type.findOne({
        _id: req.params.id
    }).then(
        (type) => {
            res.status(200).json(type);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
})


// Update Type
router.route('/update-type/:id').put((req, res, next) => {
    const type = new Type({
        _id: req.params.id,
        name: req.body.name,
        taux: req.body.taux,
    });
    Type.updateOne({_id: req.params.id}, type).then(
        () => {
            res.status(201).json({
                message: 'Type updated successfully!'
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

// Delete Type
router.route('/delete-type/:id').delete((req, res, next) => {
    Type.deleteOne({_id: req.params.id}).then(
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
