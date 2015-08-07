var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./'));

var makeRepo = function(name, callback) {
  exec('mkdir ' + __dirname + '/' + name, function() {
    return exec('git init', {cwd: __dirname + '/' + name}, callback);
  });
};

var randomFile = function(name, callback) {
  return exec('echo ' + Math.random() + ' > gh', {
    cwd: __dirname + '/' + name
  }, callback);
};

var addCommit = function(name, date, callback) {
  return exec('git add -A && git commit -am ":)" --date="' + date + '"', {
    cwd: __dirname + '/' + name
  }, callback);
};

app.post('/', function(req, res) {
  var name = req.body.name || 'github-draw-graph';
  var commits = req.body.commits || '';
  commits = commits.split('\n');
  makeRepo(name, function() {
    var graphLoop = function() {
      if(commits.length === 0) {
        return res.json({success: true});
      }
      var cur = commits.shift().split(':');
      var amount = Math.pow(cur[0], 2);
      var date = cur[1];
      var dayLoop = function() {
        if(amount <= 0) {
          return graphLoop();
        }
        randomFile(name, function() {
          amount = amount - 1;
          return addCommit(name, date, dayLoop);
        });
      };
      return dayLoop();
    };
    return graphLoop();
  });

});

app.listen(5000);
