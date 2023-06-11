const experss = require("express");
const router = experss();
const {check, validationResult} = require("express-validator")
const bodyParser = require('body-parser');
const moment = require("moment");
const Matiere = require("../model/matiere");
const Prof = require("../model/Prof");
const Cours = require("../model/cours");

// moment().format()

//route to home
router.get('/',async (req, res) => {
    try {
        const cours = await Cours.find()
        .populate('prof','nom') // Charger le modèle Prof avec le champ nom
        .populate('matiere','name') // Charger le modèle Matiere avec le champ nom
        
  
      // Calculer le total pour chaque cours
      cours.forEach((cour) => {
        const total = cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3)
        cour.total = total
    })
    dateCour = moment(cours.date).format('YYYY-MM-DD')
  
        res.status(200).json(cours);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });



router.get('/cours-list', async (req, res) => {
  try {
    const dateDeb = new Date(req.query.dateDeb);
    const dateFin = new Date(req.query.dateFin);

    const matieres = await Matiere.find().populate('taux');

    const cours = await Cours.find({
      date: { $gte: dateDeb, $lte: dateFin },
    }).populate('prof').populate('matiere');

    const coursParProf = {};
    cours.forEach((cour) => {
      const profId = cour.prof._id.toString();
      const taux = matieres.find(matiere => matiere._id.equals(cour.matiere._id)).taux.taux;
      const type = matieres.find(matiere => matiere._id.equals(cour.matiere._id)).taux.name;
      if (!coursParProf[profId]) {
        coursParProf[profId] = {
          nom: cour.prof.nom,
          prenom: cour.prof.prenom,
          Banque: cour.prof.Banque,
          Compte: cour.prof.Compte,
        };
      }
      if (!coursParProf[profId][type]) {
        coursParProf[profId][type] = {
          Taux: taux,
          total: 0,
          nbCours: 0,
        };
      }
      coursParProf[profId][type].total +=
        cour.CM + (cour.TD * 2) / 3 + (cour.TP * 2) / 3;
      coursParProf[profId][type].nbCours += 1;
    });

    const resultat = [];
    Object.values(coursParProf).forEach((cours) => {
      Object.keys(cours).forEach((type) => {
        if (type !== 'nom' && type !== 'prenom' && type !== 'Banque' && type !== 'Compte') {
          const data = {
            nom: cours.nom,
            prenom: cours.prenom,
            Banque: cours.Banque,
            Compte: cours.Compte,
            Taux: cours[type].Taux,
            total: cours[type].total,
            totalAvecTaux: cours[type].total * cours[type].Taux,
            dateDeb: dateDeb,
            dateFin: dateFin,
          };
          resultat.push(data);
        }
      });
    });

    res.status(200).json(resultat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
  

router.get('/cours-peroide', async (req, res) => {
  try {
    const dateDeb = new Date(req.query.dateDeb);
    const dateFin = new Date(req.query.dateFin);

    const matieres = await Matiere.find().populate('taux');

    const cours = await Cours.find({
      date: { $gte: dateDeb, $lte: dateFin },
    }).populate('prof').populate('matiere');


    const coursParProf = {};
    cours.forEach((cour) => {
      const profId = cour.prof._id.toString();
      const taux = matieres.find(matiere => matiere._id.equals(cour.matiere._id)).taux.taux;
      const type = matieres.find(matiere => matiere._id.equals(cour.matiere._id)).taux.name;
      if (!coursParProf[profId]) {
        coursParProf[profId] = {
          nom: cour.prof.nom,
          prenom: cour.prof.prenom,
          Banque: cour.prof.Banque,
          Compte: cour.prof.Compte,
          total: 0,
          totalAvecTaux: 0,
          data: [],
        };
      }
      coursParProf[profId].total += cour.CM + (cour.TD * 2) / 3 + (cour.TP * 2) / 3;
      coursParProf[profId].totalAvecTaux += (cour.CM + (cour.TD * 2) / 3 + (cour.TP * 2) / 3) * taux;
    
      const data = {
        Taux: taux,
        total: cour.CM + (cour.TD * 2) / 3 + (cour.TP * 2) / 3,
        totalAvecTaux: (cour.CM + (cour.TD * 2) / 3 + (cour.TP * 2) / 3) * taux,
        dateDeb: dateDeb,
        dateFin: dateFin,
      };
      coursParProf[profId].data.push(data);
    });
    
    const resultat = Object.values(coursParProf);
    
    res.status(200).json(resultat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/prof/:id', async (req, res) => {
    try {
      const prof = await Prof.findById(req.params.id);
      const cours = await Cours.find({ prof: prof._id }).populate('prof')
      .populate('matiere', 'name');

        // Calculer le total pour chaque cours
        cours.forEach((cour) => {
            const total = cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3)
            cour.total = total
        })
        res.status(200).json(cours);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  router.get('/total/:id', async (req, res) => {
    try {
      const { dateDeb, dateFin } = req.query;
      const cours = await Cours.find({prof: req.params.id,
        date: { $gte: new Date(dateDeb), $lte: new Date(dateFin) },
      }).select('-total');
      let total = 0;
      cours.forEach((cour) => {
        total += cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3);
      });
      res.json({ total });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  
//Create new Matiere
  
  router.post('/create', async (req, res, next) => {
    const { date, Deb, Fin, prof,matiere, CM, TD, TP } = req.body;
  
    // Calculer la somme de CM, TD et TP
    const total = CM + (TD * 2 / 3) + (TP * 2 / 3);
  
    try {
      const newCours = new Cours({
        matiere: req.body.matiere,
        prof: req.body.prof,
        date: req.body.date,
        Deb: req.body.Deb,
        Fin: req.body.Fin,
        CM: req.body.CM,
        TP: req.body.TP,
        TD: req.body.TD,
        total, // Ajouter le champ total dans l'objet à sauvegarder
      });
  
      await newCours.save();
  
      res.status(201).json({
        message: 'The cours was created successfully!'
    });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  


//show single Cours

router.route('/read-cours/:id').get((req, res) => {
    Cours.findOne({
        _id: req.params.id
    }).populate('prof','nom').populate('matiere', 'name').then(
        (cours) => {
            res.status(200).json(cours);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
})
// Edit Matiere
router.get('/edit/:id',async (req, res) =>{
    try {
        const cours = await Cours.findOne({_id: req.params.id})
        .populate('prof', 'nom')
        .populate('matiere');
        const profs = await Prof.find({});
        const matieres = await Matiere.find({});
        coursDate: moment(cours.date).format('YYYY-MM-DD');
        Deb: moment(cours.Deb).format('HH:MM');
        Fin: moment(cours.Fin).format('HH:MM'), 
        res.status(200).json(cours,profs,matieres);
    
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
})

router.put('/update/:id',(req, res, next) => {
  Cours.updateOne({_id: req.params.id}, req.body).then(
      () => {
          res.status(201).json({
              message: 'Cours updated successfully!'
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


//Delete Matiere
router.delete('/delete/:id', async (req, res) => {
    try {
        await Cours.deleteOne({_id: req.params.id});
        res.status(200).json('Deleted')
      } catch (err) {
        console.error(err);
        res.status(404).send('There was an error Cours was not deleted');
      }
   
})
router.delete('/deleteAll', async (req, res) => {
    try {
        await Cours.deleteMany({});
        res.status(200).json('Deleted')
      } catch (err) {
        console.error(err);
        res.status(404).send('There was an error Cours was not deleted');
      }
   
})

router.get('/total', async (req, res) => {
  try {
    const { dateDeb, dateFin } = req.query;
    const cours = await Cours.find({
      date: { $gte: new Date(dateDeb), $lte: new Date(dateFin) },
    });
    let total = 0;
    cours.forEach((cour) => {
      total += cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3);
    });
    res.json({ total,cours });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/prof/:id', async (req, res) => {
  try {
    const prof = await Prof.findById(req.params.id);
    const cours = await Cours.find({ prof: prof._id }).populate('prof', 'nom')
    .populate('matiere', 'name');

      // Calculer le total pour chaque cours
      cours.forEach((cour) => {
          const total = cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3)
          cour.total = total
      })
  } catch (err) {
    console.error(err);
    res.status(404).send('There was an error');
  }
});

router.get('/total/:id', async (req, res) => {
  try {
    const { dateDeb, dateFin } = req.query;
    const cours = await Cours.find({prof: req.params.id,
      date: { $gte: new Date(dateDeb), $lte: new Date(dateFin) },
    }).select('-total');
    let total = 0;
    cours.forEach((cour) => {
      total += cour.CM + (cour.TD * 2/3) + (cour.TP * 2/3);
    });
    res.json({ total });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router