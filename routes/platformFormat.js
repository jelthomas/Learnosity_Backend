const router = require('express').Router();
let platformFormat = require('../models/platformFormat.model');

router.route('/:username').post((req, res) => {
    platformFormat.find({ owner: { $ne: req.params.username }, is_published: true }, 'plat_name owner is_public privacy_password cover_photo pages _id').skip(req.body.index*req.body.max).limit(req.body.max)
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
});

//This route is for My Platform and Dashboard when we need to retrieve the array of PlatformFormat schemas for all the user's created and learned platforms
router.route('/getArrayof').get((req, res) => {
    platformFormat.find({ _id: {$in : req.body.platformFormat_ids}})
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
});

//gets specific platform format 
router.route('/getSpecificPlatformFormat').post((req, res) => {
    platformFormat.find({_id: req.body.id})
      .then(platformFormats => res.json(platformFormats))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getRecentPlatformFormatData').post((req, res) => {
    platformFormat.find({ _id: {$in : req.body.platformFormat_ids}}, 'pages is_published plat_name owner is_public cover_photo privacy_password')
    .then(platformFormats => {res.json(platformFormats)})
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    platformFormat.findById(req.params.id)
      .then(platformFormat => res.json(platformFormat))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getPages/:id').get((req, res) => {
    platformFormat.findById(req.params.id, 'pages -_id')
      .then(platformFormat => res.json(platformFormat))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
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

 router.route('/add').post((req, res) => {
    const plat_name = req.body.plat_name;
    const owner = req.body.owner;
    const is_public = req.body.is_public;
    const privacy_password = req.body.privacy_password;
    const cover_photo = req.body.cover_photo;
    const pages = req.body.pages;
    const is_published = req.body.is_published;
    
    const newplatformFormat = new platformFormat({
     plat_name,
     owner,
     is_public,
     privacy_password,
     cover_photo,
     pages,
     is_published,
    });

    newplatformFormat.save()
    .then(() => res.json('Platform Format added!'))
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
router.route('/update_cover_photo/:id').post((req, res) => {
    platformFormat.findById(req.params.id)
        .then(platformFormat => {
         platformFormat.cover_photo = req.body.cover_photo;
         platformFormat.save()
                .then(() => res.json('Platform Format Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;