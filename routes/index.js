var express = require('express');
var router = express.Router();
var axios = require("axios").default;
var validUrl = require('valid-url');
const { body, checkSchema, validationResult } = require('express-validator');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { layout: 'default', template: 'home-template', title: 'Youtube Downloader' });
});


router.post('/downloadmp3', function (req, res) {

  var options = {
    method: 'GET',
    url: 'https://youtube-mp36.p.rapidapi.com/dl',
    params: { id: req.body.mus },
    headers: {
      'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
      'x-rapidapi-key': 'ab7de61726mshd2142f88fc2a5bbp18445djsnd7504c3cfd38'
    }

  };
  axios.request(options).then(function (response) {
    res.redirect(response.data.link)
  }).catch(function (error) {
    console.error(error);
  });
})
router.post('/downloadmp4', function (req, res) {
  console.log(req.body.vid);
  var options = {
    method: 'GET',
    url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
    params: { id: req.body.vid },
    headers: {
      'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
      'x-rapidapi-key': 'ab7de61726mshd2142f88fc2a5bbp18445djsnd7504c3cfd38'
    }
  };
  axios.request(options).then(function (response) {
    res.redirect(response.data.link[18][0])
  }).catch(function (error) {
    console.error(error);
  });
})
const searchSchema = {
  search: {
    notEmpty: true,
    errorMessage: "Hey! Please search something..."
  }
}
const validate = validations => {
  return async (req, res, next) => {
    if (req.body.search.length > 120) {
      res.status(400)
      return res.render('index', { layout: 'default', template: 'home-template', error: "You tried to fill our database! Please try to enter some short Keyword!", title: 'Youtube Downloader' })
    }
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400)
    return res.render('index', { layout: 'default', template: 'home-template', error: "Hey! Please search something...", title: 'Youtube Downloader' })
  };
};
router.post('/', validate(checkSchema(searchSchema)), (req, res) => {
  var url = req.body.search
  if (validUrl.isUri(url)) {
    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://simple-youtube-search.p.rapidapi.com/video',
      params: { search: url },
      headers: {
        'X-RapidAPI-Host': 'simple-youtube-search.p.rapidapi.com',
        'X-RapidAPI-Key': 'ab7de61726mshd2142f88fc2a5bbp18445djsnd7504c3cfd38'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data.result.title);

      var options = {
        method: 'GET',
        url: 'https://simple-youtube-search.p.rapidapi.com/search',
        params: { query: response.data.result.title, type: 'video', safesearch: 'true' },
        headers: {
          'x-rapidapi-host': 'simple-youtube-search.p.rapidapi.com',
          'x-rapidapi-key': 'ab7de61726mshd2142f88fc2a5bbp18445djsnd7504c3cfd38'
        }
      };
      axios.request(options).then(function (response) {
        console.log(response.data.results);
        res.render('index', { layout: 'default', template: 'home-template', title: 'Youtube Downloader', 'data': response.data.results });
      }).catch(function (error) {
        return res.render('index', { layout: 'default', template: 'home-template', error: "Sorry, Youtube doesn't have what you searched for.", title: 'Youtube Downloader' })
      });
    }).catch(function (error) {
      console.error(error);
    });
  }
  else {
    var options = {
      method: 'GET',
      url: 'https://simple-youtube-search.p.rapidapi.com/search',
      params: { query: req.body.search, type: 'video', safesearch: 'true' },
      headers: {
        'x-rapidapi-host': 'simple-youtube-search.p.rapidapi.com',
        'x-rapidapi-key': 'ab7de61726mshd2142f88fc2a5bbp18445djsnd7504c3cfd38'
      }
    };
    axios.request(options).then(function (response) {
      console.log(response.data.results);
      res.render('index', { layout: 'default', template: 'home-template', title: 'Youtube Downloader', 'data': response.data.results });
    }).catch(function (error) {
      return res.render('index', { layout: 'default', template: 'home-template', error: "Sorry, Youtube doesn't have what you searched for.", title: 'Youtube Downloader' })
    });
  }




})

module.exports = router;
