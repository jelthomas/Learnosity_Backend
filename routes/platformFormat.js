const router = require('express').Router();
let platformFormat = require('../models/platformFormat.model');
let categoryData = require('../models/categoryData.model');
let categoryFormat = require('../models/categoryFormat.model'); 

router.route('/returnFormats').post((req, res) => {
    platformFormat.find({_id: {$in : req.body.ids}, is_published: true}, 'plat_name owner is_public privacy_password cover_photo categories_id').skip(req.body.index*10).limit(req.body.max)
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
  });


router.route('/getNonUserPlatforms/:username/').post((req, res) => {
    platformFormat.find({ owner: { $ne: req.params.username }, $or:[{"plat_name": { $regex : req.body.userSearch, $options: "i" }} , {"owner": { $regex : req.body.userSearch, $options: "i" }}], is_published: true, is_public: req.body.filterBy}, 'plat_name owner is_public privacy_password cover_photo _id').sort(req.body.argumentForAllPlatforms).skip(req.body.index*20).limit(req.body.max)
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
});

//Gets user's created platforms
router.route('/getCreatedPlatforms/:username/').post((req, res) => {
  platformFormat.find({ owner: req.params.username}, 'plat_name owner is_public privacy_password cover_photo categories _id').skip(req.body.index*10).limit(req.body.max)
    .then(platformFormats => res.json(platformFormats))
    .catch(err => res.status(400).json('Error: ' + err));
});

//gets specific platform format 
router.route('/getSpecificPlatformFormat/:id').get((req, res) => {
    platformFormat.find({_id: req.params.id})
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/deleteSpecificPlatformFormat/:id').delete((req, res) => {
    platformFormat.findByIdAndDelete(req.params.id)
        .then(() => res.json('Platform Format deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// adds a pageFormat ID to the pages array of the platformFormat object (platform_format_id => platformFormat ID)
router.route('/addToPages').post((req, res) => {
    platformFormat.findByIdAndUpdate({_id: req.body.platform_format_id},
      { "$push": { "pages": req.body.page_format_id } },
      { "new": true, "upsert": true }
      )
      .then( () => res.json({status: "Added to pages array!"}) )
      .catch(err => console.log("ERROR!! " + err))});

//add category to category array
router.route('/addToCategories/').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platform_format_id},
    {$addToSet: {categories:[req.body.category_id]}},
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
 router.route('/add').post((req, res) => {
    const plat_name = req.body.plat_name;
    const owner = req.body.owner;
    const is_public = req.body.is_public;
    const privacy_password = req.body.privacy_password;
    const cover_photo = req.body.cover_photo;
    const categories = req.body.categories;
    const is_published = req.body.is_published;
    
    const newplatformFormat = new platformFormat({
     plat_name,
     owner,
     is_public,
     privacy_password,
     cover_photo,
     categories,
     is_published,
    });

    newplatformFormat.save()
    .then(() => res.json(newplatformFormat))
    .catch(err => res.status(400).json('Error: ' + err));
 });

 router.route('/update/:id').post((req, res) => {
     platformFormat.findById(req.params.id)
         .then(platformFormat => {
          platformFormat.plat_name = req.body.plat_name;
          platformFormat.is_public = req.body.is_public;
          platformFormat.privacy_password = req.body.privacy_password;
          platformFormat.pages = req.body.pages;

          platformFormat.save()
                 .then(() => res.json('Platform Format Updated!'))
                 .catch(err => res.status(400).json('Error: ' + err));
         })
         .catch(err => res.status(400).json('Error: ' + err));
 })

 //Specifically used for updating Platform's is_published status
 router.route('/update_published/:id').post((req, res) => {
    platformFormat.findById(req.params.id)
        .then(platformFormat => {
         platformFormat.is_published = req.body.is_published;
         platformFormat.save()
                .then(() => res.json('Platform Format Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

//Specifically used for updating Platform's cover photo
router.route('/update_cover_photo').post((req, res) => {
    platformFormat.updateOne(
      {_id:req.body.platformID},
      {$set: {cover_photo:req.body.newCoverPhoto}},
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

//update platform name
router.route('/updatePlatName').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platformID},
    {$set: {plat_name:req.body.newPlatName}},
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
//update platform privacy
router.route('/updatePlatPrivacy').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platformID},
    {$set: {is_public:req.body.newPrivacyStatus}},
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

//update platform publish
router.route('/updatePlatPublish').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platformID},
    {$set: {is_published:req.body.newPublishStatus}},
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

//update privacy password
router.route('/updatePlatPassword').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platformID},  
    {$set: {privacy_password:req.body.newPlatPassword}},
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
//update whole platform with submit button 
router.route('/updateWholePlat').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platformID},  
    {$set: {plat_name:req.body.newPlatName,
    cover_photo:req.body.newCoverPhoto,
    is_published:req.body.newPublishStatus,
    is_public:req.body.newPrivacyStatus,
    privacy_password:req.body.newPlatPassword}},
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

router.route('/getPages/:id').get((req, res) => {
    platformFormat.findById(req.params.id, 'pages -_id')
      .then(platformFormat => res.json(platformFormat))
      .catch(err => res.status(400).json('Error: ' + err));
});

//remove value from platform format, then delete from category format, then delete category datas
router.route('/removeCategory/').post((req, res) => {
  platformFormat.updateOne(
    {_id:req.body.platform_format_id},
    {$pull : {categories :req.body.category_format_id}},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        categoryData.deleteMany(
          {category_id : req.body.category_format_id},
          function(error,data)
          {
            if(error)
            {
              console.log(error)
              
            }
            else
            {
              categoryFormat.findByIdAndRemove(
                {_id:req.body.category_format_id},
                function(err2,res2)
                {
                  if(err2)
                  {
                    console.log(err2)
                  }
                  else
                  {
                    console.log(res2)
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