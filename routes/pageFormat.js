const router = require('express').Router();
let pageFormat = require('../models/pageFormat.model');


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
            pageFormat.clock = req.body.clock;
            pageFormat.timer_answers = req.body.timer_answers;
            pageFormat.order = req.body.order;

            pageFormat.save()
                .then(() => res.json('Page Format Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;