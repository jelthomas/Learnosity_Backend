const router = require('express').Router();
let platformData = require('../models/platformData.model');

//get platform Data's using array of Learned Platform Data
router.route('/getLearnedPlatforms').post((req, res) => {
  platformData.find({ _id: {$in : req.body.platformDatas_id}, user_id: req.body.user_id})
    .then(platformDatas => res.json(platformDatas))
    .catch(err => res.status(400).json('Error: ' + err));
});

// adds a pageFormat ID to the completed_pages array of the user's platformData object (user_id => user's ID, platform_format_id => platformFormat ID)
router.route('/addToCompletedPages').post((req, res) => {
  platformData.findOneAndUpdate({platform_id: req.body.platform_format_id, user_id: req.body.user_id},
    { "$push": { "completed_pages": req.body.page_format_id } },
    { "new": true, "upsert": true }
    )
    .then( () => res.json({status: "Added to completed_pages array!"}) )
    .catch(err => console.log("ERROR!! " + err))});

//get platform Data's using array of Platform Format Ids
router.route('/getAllPlatforms').post((req, res) => {
  platformData.find({ platform_id: {$in : req.body.platformFormat_ids}, user_id: req.body.user_id}, 'completed_pages is_favorited platform_id recently_played -_id')
    .then(platformDatas => res.json(platformDatas))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get platform Data's using array of RECENT (a month ago or sooner) Learned Platform Data
router.route('/getRecentPlatforms').post((req, res) => {
  //Sets date to one month ago (Also considers edge cases of previous month having different number of days that current month)
  var d = new Date();
  var month = d.getMonth();
  d.setMonth(d.getMonth() - 1);
  while (d.getMonth() === month) {
      d.setDate(d.getDate() - 1);
  }
  // var platformDatas_arr = Array(req.body.platformDatas_id);
  platformData.find({user_id: req.body.user_id, recently_played: {$gte: d}}, 'completed_pages is_favorited platform_id -_id').sort({recently_played: 'desc'}).skip(req.body.index*5).limit(req.body.max)
    .then(platformDatas => {res.json(platformDatas)})
    .catch(err => res.status(400).json('Error: ' + err));
});

//get specific platform Data for user id and platform id
router.route('/getSpecificPlatformData').post((req, res) => {
  platformData.find({$and:[{user_id: req.body.id},{platform_id:req.body.platid}]})
    .then(platformDatas => res.json(platformDatas))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get specific platform Data (only completed_pages) for user id and platform id
router.route('/getPlatformDataCompletedPages').post((req, res) => {
  platformData.find({$and:[{user_id: req.body.id},{platform_id:req.body.platid}]}, 'completed_pages -_id')
    .then(platformDatas => res.json(platformDatas[0]))
    .catch(err => res.status(400).json('Error: ' + err));
});

//deletes all of a users data schemas if we delete the user
// router.route('/deleteSpecificPlatformData/:id').delete((req, res) => {
//   platformData.findByIdAndDelete(req.params.id)
//       .then(() => res.json('Platform Data deleted.'))
//       .catch(err => res.status(400).json('Error: ' + err));
// });

//adds a platform Data entry 
router.route('/add').post((req, res) => {
  const user_id = req.body.user_id;
  const platform_id = req.body.platform_id;
  const completed_pages = req.body.completed_pages;
  const is_favorited = req.body.is_favorited;
  const is_completed = req.body.is_completed;
  const recently_played = Date.parse(req.body.recently_played);

  const newplatformData = new platformData({
    user_id, 
    platform_id,
    completed_pages,
    is_favorited, 
    is_completed,
    recently_played
  });

  newplatformData.save()
  .then(() => res.json('PlatformData added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

//adds a platformData for favoriting platforms you never played
router.route('/addFavorite').post((req, res) => {
  const user_id = req.body.user_id;
  const platform_id = req.body.platform_id;
  const completed_pages = req.body.completed_pages;
  const is_favorited = req.body.is_favorited;
  const is_completed = req.body.is_completed;
  const recently_played = null;

  const newplatformData = new platformData({
    user_id, 
    platform_id,
    completed_pages,
    is_favorited, 
    is_completed,
    recently_played
  });

  newplatformData.save()
  .then(() => res.json('PlatformData added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/updateRecentlyPlayed/').post((req, res) => {
  platformData.updateOne(
    {user_id:req.body.user_id,platform_id:req.body.platform_id},
    {$set: {recently_played:req.body.newRecentlyPlayed}},
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

//update Completed Page
router.route('/updateCompletedPage/').post((req, res) => {
  platformData.updateOne(
    {user_id:req.body.user_id,platform_id:req.body.platform_id},
    {$addToSet: {completed_pages:[req.body.page_id]}},
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

//
router.route('/clearCompletedPage/').post((req, res) => {
  platformData.updateOne(
    {user_id:req.body.user_id,platform_id:req.body.platform_id},
    {$set: {completed_pages:[]}},
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

//set is_completed to true 
router.route('/setCompletedTrue/').post((req, res) => {
  platformData.updateOne(
    {user_id:req.body.user_id,platform_id:req.body.platform_id},
    {$set: {is_completed:true}},
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

//updates the platform Data by ID
router.route('/update/:id').post((req, res) => {
  platformData.findById(req.params.id)
      .then(platformData => {
        platformData.user_id = req.body.user_id;
        platformData.platform_id = req.body.platform_id;
        platformData.completed_pages = req.body.completed_pages;
        platformData.is_favorited = req.body.is_favorited;
        platformData.is_completed = req.body.is_completed;
        platformData.recently_played = req.body.recently_played;
          platformData.save()
              .then(() => res.json('Platform Data Updated!'))
              .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
})

//updates the platform Data is_favorited by ID
router.route('/toggleFavorited').post((req, res) => {
  platformData.find({platform_id: req.body.id, user_id: req.body.user_id})
  .then(platformData => {
    platformData[0].is_favorited = req.body.is_favorited;
    platformData[0].save()
      .then(() => res.json('Platform Data is_favorited toggled!'))
      .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/updatePages/:id').post((req, res) => {
  platformData.findById(req.params.id)
      .then(platformData => {
        platformData.completed_pages = req.body.completed_pages;
          platformData.save()
              .then(() => res.json('Platform Data Pages Updated!'))
              .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;