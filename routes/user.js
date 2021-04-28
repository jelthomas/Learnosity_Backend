const router = require('express').Router();
const bcrypt = require("bcrypt");
const cors = require("cors");

router.use(cors());


let user = require('../models/user.model');

router.route('/getAllUsers').get((req, res) => {
    user.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// gets Security Question for a User or Email
// specifically selects just the one value 
router.route('/getSecurityQuestion/:identifier').get((req, res) => {
  user.find({$or:[{username: req.params.identifier},{email:req.params.identifier}]}).select('security_question -_id')
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

// selects just the learned_platforms array for a specific user's ID
router.route('/getLearnedPlatforms/:id').get((req, res) => {
  user.findById(req.params.id).select('learned_platforms -_id')
    .then(user => res.json(user.learned_platforms))
    .catch(err => res.status(400).json('Error: ' + err));
});

// adds a platformData ID to the learned_platforms array of the user (id => user's ID, learned_id => platformData ID)
router.route('/addLearnedPlatform').post((req, res) => {
  user.findByIdAndUpdate(req.body.id,
    { "$push": { "learned_platforms": req.body.learned_id } },
    { "new": true, "upsert": true }
    )
    .then( () => res.json({status: "Added to learned array!"}) )
    .catch(err => console.log("ERROR!! " + err))});

router.route('/getID/:identifier').get((req, res) => {
  user.find({$or:[{username: req.params.identifier},{email:req.params.identifier}]}).select('_id')
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getEmail/:email').get((req, res) => {
  user.find({email: req.params.email})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getSecurityAnswer/:identifier').get((req, res) => {
  user.find({$or:[{username: req.params.identifier},{email:req.params.identifier}]}).select('security_answer -_id')
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getSpecificUser/:id').get((req, res) => {
  user.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/deleteSpecificUser/:id').delete((req, res) => {
  user.findByIdAndDelete(req.params.id)
      .then(() => res.json('User deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
});



router.post('/signup', (req,res)=>{
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const security_question = req.body.security_question;
  const security_answer = req.body.security_answer;
  const total_time_played = req.body.total_time_played;
  const completed_platforms = req.body.completed_platforms;
  const experience_points = req.body.experience_points;

  const newUser = new user({
    username, 
    email,
    password,
    security_question,
    security_answer,
    total_time_played,
    completed_platforms,
    experience_points
  });

  user.findOne({$or:[{username: req.body.username},{email:req.body.email}]})
  .then(tempUser => {
    if(!tempUser){
      bcrypt.hash(req.body.password, 10, (err,hash) =>{
        newUser.password = hash;


        bcrypt.hash(req.body.security_answer, 10, (err,hash2) =>{
          newUser.security_answer = hash2;
        
          user.create(newUser)
          .then(user => {
            res.json({status: user.username + " registered!"})
          })
          .catch(err =>{
            res.send("Error: " + err);
          })
        })

      })
    }
    else{
      res.json({error: "User already exists"})
    }
  })
  .catch(err =>{
    res.send("Error: " + err);
  })
});

router.post('/login', (req,res)=>{
  user.findOne({$or:[{username: req.body.identifier},{email:req.body.identifier}]})
  .then(tempUser => {
    if(tempUser){
      if(bcrypt.compareSync(req.body.password, tempUser.password)){
        const payload = {
          _id: tempUser._id,
          username: tempUser.username
        }
        res.json({payload: payload});
      }
      else{
        res.json({error: "Incorrect Password"})
      }
    }
    else{
      res.json({error: "User does not exist"})
    }
  })
  .catch(err => {
    res.send("Error: " + err);
  })
});

router.post('/updatePassword/:identifier',(req, res) => {

  bcrypt.hash(req.body.password, 10, (err,hash) =>{
    user.updateOne(
      {$or:[{username: req.params.identifier},{email:req.params.identifier}]}, 
      {password:hash}, 
      function (err, data) {
      if (err){
          console.log(err)
      }
      else{
          res.send(data)
      }
    });
  })
})

router.route('/updateProfilePicture/:id').post((req, res) => {
  user.findById(req.params.id)
      .then(user => {
        user.profile_picture = req.body.profile_picture;

          user.save()
              .then(() => res.json('User Profile Picture Updated!'))
              .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/compareSecurityAnswer/:identifier', (req,res)=>{
  user.findOne({$or:[{username: req.params.identifier},{email:req.params.identifier}]})
  .then(tempUser => {
    if(tempUser){
      if(bcrypt.compareSync(req.body.security_answer, tempUser.security_answer)){
        const payload = {
          answer: true
        }
        res.send(payload);
      }
      else{
        const payload = {
          answer: false
        }
        res.send(payload);
      }
    }
    else{
      res.json({error: "User does not exist"})
    }
  })
  .catch(err => {
    res.send("Error: " + err);
  })
});


module.exports = router;