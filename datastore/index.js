const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  
  counter.getNextUniqueId((err, id) => {
    var pathName = exports.dataDir + '/' + id + '.txt';
    if (err) {
      throw('error getting next unique id, yo')
    } else {
      fs.writeFile(pathName, text, (err) => {
        items[id] = text;
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id, text });
        }
       
      });
    }
  });
};

exports.readAll = (callback) => {
  // list of files
  fs.readdir(exports.dataDir, function(err, fileNames) {
    console.log(fileNames);
    if (err) {
      throw ('error getting directory');
    }
    fileNames.forEach(function(fileName) {
      fs.readFile(exports.dataDir + '/' + fileName, function(err, content) {
        
        if (err) {
          callback(new Error('no file'));
        } else {
          callback(null, content.toString());
        }
      })
    })

  })

};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (error, content) => {

    if (error) {
      callback(new Error('false todo'));
    } else {
      callback(null, {id, text: content.toString()});
    }
  })
};

exports.update = (id, text, callback) => {
  var pathName = exports.dataDir + '/' + id + '.txt'; 

  fs.readFile(pathName, (error, content) => {
    if (error) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathName, text, (error) => {
        console.log('ERROR:', error);
        if (error) {
          callback(new Error(`No item with id: ${id}`))
        } else {
          console.log('y');
          callback(null, { id, text });
        }
      });
    }
  })
};

exports.delete = (id, callback) => {
  var pathName = exports.dataDir + '/' + id + '.txt';

  fs.readFile(pathName, (error, content) => {
    if (error) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, fs.unlink(pathName));
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
