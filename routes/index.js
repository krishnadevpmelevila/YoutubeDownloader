var express = require('express');
var router = express.Router();
var axios = require("axios").default;
const { body, checkSchema, validationResult } = require('express-validator');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {layout: 'default', template: 'home-template',title:'Youtube Downloader'});
});


router.post('/downloadmp3',function(req,res){
  
  var options = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: {id: req.body.mus},
    headers: {
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
      'x-rapidapi-key': '149496b202msh3bc1ce64534abfbp12c6c3jsn0da37c1922b6'
    }

  };
  axios.request(options).then(function (response) {
    res.redirect(response.data.link)
  }).catch(function (error) {
    console.error(error);
  });
})
router.post('/downloadmp4',function(req,res){
  console.log(req.body.vid);
  var options = {
    method: 'GET',
    url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
    params: {id: req.body.vid},
    headers: {
      'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
      'x-rapidapi-key': '149496b202msh3bc1ce64534abfbp12c6c3jsn0da37c1922b6'
    }
  };
  axios.request(options).then(function (response) {
    res.redirect(response.data.link[18][0])
  }).catch(function (error) {
    console.error(error);
  });
})
const searchSchema={
  search:{
    notEmpty:true,
    errorMessage:"Hey! Please search something..."
  }
}
const validate = validations => {
  return async (req, res, next) => {
    if (req.body.search.length>120){
      res.status(400)
      return res.render('index',{layout: 'default', template: 'home-template',error:"You tried to fill our database! Please try to enter some short Keyword!",title:'Youtube Downloader'})
    }
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
          return next();
      }
      
      res.status(400)
      return res.render('index',{layout: 'default', template: 'home-template',error:"Hey! Please search something...",title:'Youtube Downloader'})
  };
};
router.post('/',validate(checkSchema(searchSchema)),(req,res)=>{
  


  var options = {
    method: 'GET',
    url: 'https://simple-youtube-search.p.rapidapi.com/search',
    params: {query: req.body.search, type: 'video', safesearch: 'true'},
    headers: {
      'x-rapidapi-host': 'simple-youtube-search.p.rapidapi.com',
      'x-rapidapi-key': '149496b202msh3bc1ce64534abfbp12c6c3jsn0da37c1922b6'
    }
  };

  axios.request(options).then(function (response) {
    res.render('index',{layout: 'default', template: 'home-template',title:'Youtube Downloader','data':response.data.results});
  }).catch(function (error) {
    return res.render('index',{layout: 'default', template: 'home-template',error:"Sorry, Youtube doesn't have what you searched for.",title:'Youtube Downloader'})
  });
  // res.send({
  //   data:req.body.search
  // })
})

module.exports = router;
