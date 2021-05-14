const router = require('express').Router();
let categoryFormat = require('../models/categoryFormat.model');
let pageFormat = require('../models/pageFormat.model');

router.route('/add').post((req, res) => {
    const category_name = req.body.cat_name;
    const platform_id = req.body.platform_id;
    const category_photo = req.body.cat_photo;
    const pages = req.body.pages;
  
    const newcategoryFormat = new categoryFormat({
      category_name, 
      platform_id,
      category_photo,
      pages, 
    });
  
    newcategoryFormat.save()
    .then(() => res.json(newcategoryFormat))
    .catch(err => res.status(400).json('Error: ' + err));
  });


router.route('/getAllCategories').post((req, res) => {
  categoryFormat.find({ _id: {$in : req.body.categories_id}}).sort({order: 'asc'})
    .then(categoriesData => {res.json(categoriesData)})
    .catch(err => res.status(400).json('Error: ' + err));
});


//gets specific category format 
router.route('/getSpecificCategoryFormat/:id').get((req, res) => {
  categoryFormat.find({_id: req.params.id})
    .then(platformFormats => res.json(platformFormats))
    .catch(err => res.status(400).json('Error: ' + err));
});

//gets pages 
router.route('/getPages/:id').get((req, res) => {
  categoryFormat.findById(req.params.id, 'pages -_id')
    .then(categoryFormat => res.json(categoryFormat))
    .catch(err => res.status(400).json('Error: ' + err));
});

//Increment times_played
router.route('/increment_times_played').post((req, res) => {
  categoryFormat.updateOne(
    {_id: req.body._id},
    {$set: {times_played: req.body.times_played}},
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


//Used for updating category format's cover photo
router.route('/update_category_photo').post((req, res) => {
  categoryFormat.updateOne(
    {_id:req.body.categoryID},
    {$set: {category_photo:req.body.newCategoryPhoto}},
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

//update category name
router.route('/updateCatName').post((req, res) => {
  categoryFormat.updateOne(
    {_id:req.body.categoryID},
    {$set: {category_name:req.body.newCatName}},
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

router.route('/addToPages/').post((req, res) => {
  categoryFormat.updateOne(
    {_id:req.body.category_format_id},
    {$addToSet: {pages:[req.body.page_format_id]}},
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

//Deletes Category Format
router.route('/removeCategoryFormat').post((req,res) =>{
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
        console.log("Deleted Quiz!");
        res.send(res2);
      }
    }
  )
})

//update whole platform with submit button 
router.route('/updateWholeCat').post((req, res) => {
  categoryFormat.updateOne(
    {_id:req.body.categoryID},  
    {$set: {category_name:req.body.newCategoryName,
    category_photo:req.body.newCategoryPhoto,}},
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

module.exports = router;