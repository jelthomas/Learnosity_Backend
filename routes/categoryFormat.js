const router = require('express').Router();
let categoryFormat = require('../models/categoryFormat.model');

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


//get pageFormats using array of pageFormatID
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

module.exports = router;