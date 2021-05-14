const router = require('express').Router();
let categoryData = require('../models/categoryData.model');

//adds a category Data entry 
router.route('/add').post((req, res) => {
    const user_id = req.body.user_id;
    const category_id = req.body.category_id;
    const completed_pages = req.body.completed_pages;
    const currentProgress_pages = req.body.current_progress;
    const is_completed = req.body.is_completed;
    const accuracy = req.body.accuracy;
  
    const newcategoryData = new categoryData({
      user_id, 
      category_id,
      completed_pages,
      currentProgress_pages, 
      is_completed,
      accuracy
    });
  
    newcategoryData.save()
    .then(() => res.json('Category Data added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  });

//get specific Category Data current progress pages, is_completed, and completed_pages for user id and platform id
router.route('/getCategoryDataCurrentProgressPages').post((req, res) => {
  categoryData.find({$and:[{user_id: req.body.id},{category_id:req.body.catid}]}, 'currentProgress_pages is_completed completed_pages -_id')
    .then(platformDatas => res.json(platformDatas[0]))
    .catch(err => res.status(400).json('Error: ' + err));
});

//get specific Category Data accuracy for user id and platform id
router.route('/getAccuracy_and_completed_pages').post((req, res) => {
  categoryData.find({$and:[{user_id: req.body.id},{category_id: req.body.cat_id}]}, 'accuracy completed_pages -_id')
    .then(platformDatas => {res.json(platformDatas[0])})
    .catch(err => res.status(400).json('Error: ' + err));
});

//get all Category Data for all category_format IDs for that User
router.route('/getAllCategoryData').post((req, res) => {
  categoryData.find({ category_id: {$in : req.body.categories_id}, user_id: req.body.user_id})
    .then(categoriesData => {res.json(categoriesData)})
    .catch(err => res.status(400).json('Error: ' + err));
});

//increment accuracy by
router.route('/increment_accuracy_by').post((req, res) =>{
  categoryData.updateOne(
    {user_id: req.body.user_id, category_id: req.body.cat_id},
    {$inc : {'accuracy' : req.body.inc}},

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

//divide accuracy by
router.route('/set_accuracy').post((req, res) =>{
  var accuracy = parseFloat(req.body.accuracy);
  categoryData.updateOne(
    {user_id: req.body.user_id, category_id: req.body.cat_id},
    {$set : {'accuracy' : accuracy}},

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


//update completed page and current progress
router.route('/updatePageArrays/').post((req, res) => {
  categoryData.updateOne(
    {user_id:req.body.user_id,category_id:req.body.cat_id},
    {$addToSet: {completed_pages:[req.body.page_id],currentProgress_pages:[req.body.page_id]}},

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

//prob wont be needing these anymore 
//update completed Page
router.route('/updateCompletedPage/').post((req, res) => {
  categoryData.updateOne(
    {user_id:req.body.user_id,category_id:req.body.cat_id},
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

//prob wont be needing this anymore 
//update currentProgress
router.route('/updateCurrentProgress/').post((req, res) => {
  categoryData.updateOne(
    {user_id:req.body.user_id,category_id:req.body.cat_id},
    {$addToSet: {currentProgress_pages:[req.body.page_id]}},
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

//Clear current_progress array
router.route('/clearCurrentProgress/').post((req, res) => {
  categoryData.updateOne(
    {user_id: req.body.user_id, category_id: req.body.category_format_id},
    {$set: {currentProgress_pages: []}},
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

//Update updatedAt field
router.route('/updatedAt').post((req, res) => {
  var d = new Date();
  categoryData.updateOne(
    {user_id: req.body.user_id, category_id: req.body.category_format_id},
    {$set: {updatedAt: d}},
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

//get specific category Data for user id and platform id
router.route('/getSpecificCategoryData').post((req, res) => {
  categoryData.find({$and:[{user_id: req.body.id},{category_id:req.body.catid}]})
    .then(platformDatas => res.json(platformDatas))
    .catch(err => res.status(400).json('Error: ' + err));
});

//set is_completed to true 
router.route('/setCompletedTrue/').post((req, res) => {
  categoryData.updateOne(
    {user_id:req.body.user_id,category_id:req.body.cat_id},
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

//Deletes Category Data
router.route('/removeCategoryDatas').post((req,res) =>{
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
        console.log("Deleted category data")
        res.send(data);
      }
    }
  )
})


module.exports = router;