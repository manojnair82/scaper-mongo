const db = require("../models");

// Defining methods for the scrapeController
module.exports = {

  app.post('/remove/:id', function(req, res) {
  MongoHeadline.findByIdAndUpdate(
    req.params.id,
    {$pull: {
      comments: {
        _id: req.body.id
      }
    }},
    {new: true},
    function(err, data) {
      if (err) return console.error(err);
      res.json(data.comments);
    }
  );
});

  removeComment: function(req, res) {
    db.MongoHeadline
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByIdUsers: function(req, res) {
    db.User
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

 findAllNodes: function(req, res) {
    db.Comp
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
}


var MongoHeadline = require('./models/DataModel');

var options = {
  url: 'https://www.bodybuilding.com/fun/whats-new.html',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
  }
};
request(options, function(error, response, html) {
  var $ = cheerio.load(html);
  $('div.new-content-block').each(function(i, element) {
    var $a = $(this).children('a');
    var $div = $(this).children('div');
    var articleURL = $a.attr('href');
    var imgURL = $a.children('img').attr('src');
    var title = $div.children('h4').text();
    var synopsis = $div.children('p').text();
    var mongoHeadline = new MongoHeadline({
      title: title,
      imgURL: imgURL,
      synopsis: synopsis,
      articleURL: articleURL
    });
    mongoHeadline.save(function(err) {
      if (err) {
      }
    });
  });
});

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.get('/', function(req, res) {
  MongoHeadline
    .findOne()
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.render('index', {
        imgURL: data.imgURL,
        title: data.title,
        synopsis: data.synopsis,
        _id: data._id,
        articleURL: data.articleURL,
        comments: data.comments
      });
    })
});

app.get('/next/:id', function(req, res) {
  MongoHeadline
    .find({
      _id: {$gt: req.params.id}
    })
    .sort({_id: 1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

app.get('/prev/:id', function(req, res) {
  MongoHeadline
    .find({
      _id: {$lt: req.params.id}
    })
    .sort({_id: -1 })
    .limit(1)
    .exec(function(err,data) {
      if (err) return console.error(err);
      res.json(data);
    })
});

app.post('/comment/:id', function(req, res) {
  MongoHeadline.findByIdAndUpdate(
    req.params.id,
    {$push: {
      comments: {
        text: req.body.comment
      }
    }},
    {upsert: true, new: true},
    function(err, data) {
      if (err) return console.error(err);
      res.json(data.comments);
    }
  );
});

