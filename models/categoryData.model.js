const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoryDataSchema = new Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, required: true},
  category_id: {type: mongoose.Schema.Types.ObjectId, required: true},
  //completed pages will keep track of any page a user has encountered; deleted pages included
  completed_pages: [mongoose.Schema.Types.ObjectId],
  //current Progress pages will keep track of current progress when they are going through the category
  currentProgress_pages: [mongoose.Schema.Types.ObjectId],
  //is_completed lets us know when to keep track of accuracy
  //when its true you can display accuracy
  is_completed: {type:Boolean, default:false},
  // accuracy shows how user did in category 
  accuracy: {
    type: Number, 
    required: true, 
    default: 0
  }, 
}, {
  timestamps: true,
});

const categoryData = mongoose.model('categoryData', categoryDataSchema);

module.exports = categoryData;