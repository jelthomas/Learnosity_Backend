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

//get specific Category Data current progress pages for user id and platform id
router.route('/getCategoryDataCurrentProgressPages').post((req, res) => {
  categoryData.find({$and:[{user_id: req.body.id},{category_id:req.body.catid}]}, 'currentProgress_pages -_id')
    .then(platformDatas => res.json(platformDatas[0]))
    .catch(err => res.status(400).json('Error: ' + err));
});

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
module.exports = router;