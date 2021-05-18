const router = require('express').Router();
const bcrypt = require("bcrypt");
const cors = require("cors");

router.use(cors());


let user = require('../models/user.model');
let platformFormat = require('../models/platformFormat.model');
let categoryData = require('../models/categoryData.model');
let categoryFormat = require('../models/categoryFormat.model'); 

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
  const created_platforms = req.body.created_platforms;
  const total_time_played = req.body.total_time_played;
  const completed_categories = req.body.completed_categories;
  const experience_points = req.body.experience_points;
  const favorited_platforms = req.body.favorited_platforms;

  const newUser = new user({
    username, 
    email,
    password,
    security_question,
    security_answer,
    created_platforms,
    total_time_played,
    completed_categories,
    experience_points,
    favorited_platforms
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

router.post('/changePassword',(req, res) => {
  if(bcrypt.compareSync(req.body.password, req.body.confirm_password)){
    res.send({value: 'invalid'});
  }
  else{
    bcrypt.hash(req.body.password, 10, (err,hash) =>{
      user.updateOne(
        {username: req.body.identifier}, 
        {password: hash}, 
        function (err, data) {
        if (err){
            console.log(err)
        }
        else{
            res.send(data)
        }
      });
    
    })
  }
})

router.route('/updateRecentlyPlayed').post((req, res) => {
  user.updateOne(
    {_id:req.body.userID},
    {$set: {recent_platforms: req.body.recent_platforms}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

router.route('/updateFavoritePlatforms').post((req, res) => {
  user.updateOne(
    {_id:req.body.userID},
    {$set: {favorited_platforms: req.body.fav_plats}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

router.route('/updateCreatedPlatforms').post((req, res) => {
  user.updateOne(
    {_id:req.body.userID},
    {$addToSet: {created_platforms: [req.body.newPlat]}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

router.route('/updateProfilePicture').post((req, res) => {
  user.updateOne(
    {_id:req.body.user_id},
    {$set: {profile_picture:req.body.newPicture}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

// router.route('/updateProfilePicture/:id').post((req, res) => {
//   user.findById(req.params.id)
//       .then(user => {
//         user.profile_picture = req.body.profile_picture;

//           user.save()
//               .then(() => res.json('User Profile Picture Updated!'))
//               .catch(err => res.status(400).json('Error: ' + err));
//       })
//       .catch(err => res.status(400).json('Error: ' + err));
// })

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

//increment total accuracy by
router.route('/increment_total_accuracy_by').post((req, res) =>{
  user.updateOne(
    {_id: req.body.user_id},
    {$inc : {'total_accuracy' : req.body.inc}},

    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

//increment experience_points
router.route('/increment_experience_points_by').post((req, res) =>{
  user.updateOne(
    {_id: req.body.user_id},
    {$inc : {'experience_points' : req.body.inc}},


    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

//increment completed categories by 1
router.route('/increment_completed_categories_by').post((req, res) =>{
  user.updateOne(
    {_id: req.body.user_id},
    {$inc : {'completed_categories' : 1}},

    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.send(response)
      }
    }
  )
})

//Remove from user's recently played platforms
router.route('/remove_from_recently_played').post((req, res) => {
  user.updateMany(
    {$pull : {recent_platforms :req.body.platform_format_id}},
    function(error,data)
    {
      if(error)
      {
        console.log(error)
        
      }
      else
      {
        res.send(data);
      }
})})

router.route('/removeUser').post((req,res) => {
  categoryData.deleteMany(
    {category_id : {$in : req.body.category_format_ids}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        categoryFormat.deleteMany(
          {_id : {$in : req.body.category_format_ids}},
          function(err2,res2)
          {
            if(err2)
            {
              console.log(err2)
            }
            else
            {
              user.updateMany(
                {$pull : {recent_platforms : {$in: req.body.created_platform_ids},favorited_platforms : {$in: req.body.created_platform_ids} }},
                function(err3,res3)
                {
                  if(err3)
                  {
                    console.log(err3)
                  }
                  else
                  {
                    platformFormat.deleteMany(
                      {_id:{$in: req.body.created_platform_ids}},
                      function(err4,res4)
                      {
                        if(err4)
                        {
                          console.log(err4)
                        }
                        else
                        {
                          user.deleteOne(
                            {_id:req.body.user_format_id},
                            function(err5,res5)
                            {
                              if(err5)
                              {
                                console.log(err5)
                              }
                              else
                              {
                                res.send(res5)
                              }
                            }
                          )
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    }
  )
})



module.exports = router;