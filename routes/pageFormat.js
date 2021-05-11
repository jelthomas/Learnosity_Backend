const router = require('express').Router();
let pageFormat = require('../models/pageFormat.model');
let categoryData = require('../models/categoryData.model');
let categoryFormat = require('../models/categoryFormat.model');


//get pageFormats using array of pageFormatID
router.route('/getAllPages').post((req, res) => {
    pageFormat.find({ _id: {$in : req.body.pages_id}}).sort({order: 'asc'})
      .then(pagesData => {res.json(pagesData)})
      .catch(err => res.status(400).json('Error: ' + err));
  });

//update page name
router.route('/updatePageName').post((req, res) => {
    pageFormat.updateOne(
      {_id:req.body.pageID},
      {$set: {page_title:req.body.newPageName}},
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


//update prompt
router.route('/updatePrompt').post((req, res) => {
    pageFormat.updateOne(
      {_id:req.body.pageID},
      {$set: {prompt:req.body.newPrompt}},
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
router.route('/updatePageType').post((req, res) => {
    pageFormat.updateOne(
      {_id:req.body.pageID},
      {$set: {type:req.body.newPageType}},
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
router.route('/getSpecificPage/:id').get((req, res) => {
    pageFormat.findById(req.params.id)
      .then(pageFormat => res.json(pageFormat))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/deleteSpecificPage/:id').delete((req, res) => {
    pageFormat.findByIdAndDelete(req.params.id)
        .then(() => res.json('PageFormat deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
   const type = req.body.type;
   const prompt = req.body.prompt;
   const audio_file = req.body.audio_file;
   const page_title = req.body.page_title;
   const multiple_choices = req.body.multiple_choices;
   const multiple_choice_answer = req.body.multiple_choice_answer;
   const matching_pairs = req.body.matching_pairs;
   const fill_in_the_blank_answers = req.body.fill_in_the_blank_answers;
   const fill_in_the_blank_prompt = req.body.fill_in_the_blank_prompt;
   const clock = req.body.clock;
   const timer_answers = req.body.timer_answers;
   const order = req.body.order;
   const newpageFormat = new pageFormat({
    type,
    prompt,
    audio_file,
    page_title,
    multiple_choices,
    multiple_choice_answer,
    matching_pairs,
    fill_in_the_blank_answers,
    fill_in_the_blank_prompt,
    clock,
    timer_answers,
    order
   });

   newpageFormat.save()
   .then(() => res.json(newpageFormat))
   .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addToMCC/').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.page_format_id},
    {$push: {multiple_choices: req.body.value}},
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

router.route('/addToMP/').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.page_format_id},
    {$set: req.body.newPair},
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

//update multiple choice answer
router.route('/updateMultipleChoiceAnswer').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {multiple_choice_answer:req.body.newMCAnswer}},
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

//update multiple choice choice
router.route('/updateMultipleChoiceChoice').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {multiple_choices:req.body.newChoices}},
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

//updating matching pair
router.route('/updateMatchingPair').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {matching_pairs:req.body.newMatching}},
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

//updating fib
router.route('/updatefibAnswer').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {fill_in_the_blank_answers:req.body.newfibAnswers}},
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

//updating fib
router.route('/updatefibPromptAnswer').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {fill_in_the_blank_answers:req.body.newfibAnswers, fill_in_the_blank_prompt : req.body.newfibPrompt}},
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

//updating whole page
router.route('/updateMC').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},
    {$set: {type:req.body.newType, multiple_choices : req.body.newMCC,multiple_choice_answer:req.body.newMCA}},
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

router.route('/update/:id').post((req, res) => {
    pageFormat.findById(req.params.id)
        .then(pageFormat => {
            pageFormat.type = req.body.type;
            pageFormat.prompt = req.body.prompt;
            pageFormat.audio_file = req.body.audio_file;
            pageFormat.page_title = req.body.page_title;
            pageFormat.multiple_choices = req.body.multiple_choices;
            pageFormat.multiple_choice_answer = req.body.multiple_choice_answer;
            pageFormat.matching_pairs = req.body.matching_pairs;
            pageFormat.fill_in_the_blank_answers = req.body.fill_in_the_blank_answers;
            pageFormat.fill_in_the_blank_prompt = req.body.fill_in_the_blank_prompt;
            pageFormat.clock = req.body.clock;
            pageFormat.timer_answers = req.body.timer_answers;
            pageFormat.order = req.body.order;

            pageFormat.save()
                .then(() => res.json('Page Format Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

//update whole page when its MC Type with submit button 
router.route('/updateWholeMCPage').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},  
    {$set: {prompt:req.body.newPrompt,
    type : req.body.newType,
    page_title:req.body.newPageTitle,
    multiple_choices:req.body.newMCC,
    multiple_choice_answer:req.body.newMCA}},
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

//update whole page when its FIB Type with submit button 
router.route('/updateWholeFIBPage').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},  
    {$set: {type:req.body.newType,
    page_title:req.body.newPageTitle,
    fill_in_the_blank_prompt:req.body.newfibPrompt}},
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

router.route('/updateWholeMatchingPage').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},  
    {$set: {type:req.body.newType,
    page_title:req.body.newPageTitle,
    prompt:req.body.newPrompt,
    matching_pairs : req.body.newMatchingPairs}},
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

router.route('/updateWholeTimerPage').post((req, res) => {
  pageFormat.updateOne(
    {_id:req.body.pageID},  
    {$set: {type:req.body.newType,
    page_title:req.body.newPageTitle,
    prompt:req.body.newPrompt,
    timer_answers : req.body.newTimer}},
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

//remove page from page Schema and categoryData Schema
// router.route('/removePage/').post((req, res) => {
//   pageFormat.findByIdAndRemove(
//     {_id:req.body.page_format_id},
//     function(err,response)
//     {
//       if(err)
//       {
//         console.log(err)
//       }
//       else
//       {
//         categoryData.updateMany(
//           {$pull : {completed_pages :req.body.page_format_id},
//           function(error,res)
//           {
//             if(error)
//             {
//               console.log(error)
//             }
//             else
//             {
//               console.log(res)
//             }
//           }
//         )
//       }
//     }
//   )
// })

// router.route('/removePage/').post((req, res) => {
//   pageFormat.findByIdAndRemove(
//     {_id:req.body.page_format_id},
//     function(err,response)
//     {
//       if(err)
//       {
//         console.log(err)
//       }
//       else
//       {
//         categoryData.updateMany(
//           {$pull : {completed_pages :req.body.page_format_id},
//           function(error,res)
//           {
//             if(error)
//             {
//               console.log(error)
//             }
//             else
//             {
//               console.log(res)
//             }
//           }
//           }
//         )
//       }
//     }
//   )
// })

router.route('/removePage/').post((req, res) => {
  pageFormat.findByIdAndRemove(
    {_id:req.body.page_format_id},
    function(err,response)
    {
      if(err)
      {
        console.log(err)
      }
      else
      {
        categoryFormat.updateMany(
          {},
          {$pull : {pages :req.body.page_format_id}},
          function(error,data)
          {
            if(error)
            {
              console.log(error)
              
            }
            else
            {
              console.log(data)
              categoryData.updateMany(
                {},
                {$pull : {completed_pages : req.body.page_format_id,
                  currentProgress_pages : req.body.page_format_id
                }},
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