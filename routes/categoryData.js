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
module.exports = router;