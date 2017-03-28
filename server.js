'use strict';

// HTTP with express
// requires

var express     = require('express');
var mysql       = require('mysql');
var config      = require('./sql_config.json');
var bodyParser  = require('body-parser');
// mysql -u root -p  <- gives access to database
var sql = mysql.createConnection(config.mysql);
var app = express();


app.use(bodyParser.urlencoded({
    extented: false
}));
app.use(bodyParser.json());


// constants for directories
var webpage = __dirname + '/webpage/';

//////////////////////////////////////////////////////////////////
// logging
app.use('/', function(req, res, next) {
    console.log(new Date(), req.method, req.url);
    next();
});

sql.connect(function(error) {
    //callback
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});

app.post('/api/notes/save', saveNote);
app.post('/api/newEvent/save', saveEvent);


app.get('/api/notes', function(req, res) {
    // prepare query
    var query = 'SELECT id, title, content FROM stickyNotes';
    if (req.query.id) {
        query += ' WHERE id LIKE ' + sql.escape('%' + req.query.id + '%');
          console.log(query);
    }

    // now query the table and output the results
    sql.query(query, function(err, data) {
        if (err) return error(res, 'failed to run the query', err);

        res.json(data);

    });

});


app.get('/api/getEvents', function(req, res) {
//    var query = 'SELECT id, selected_Date, start_Hour, end_Hour, task FROM calendar WHERE DATE(selected_Date)=CURDATE()';
var query = 'SELECT id, selected_Date, start_Hour, end_Hour, task FROM calendar';
  //    var query = 'SELECT id, selected_Date, start_Hour, end_Hour, task FROM calendar WHERE selected_Date = '2017-01-28'';
      //  console.log(query);
        console.log();
    if (req.query.id) {
      query += ' WHERE id LIKE ' + sql.escape('%' + req.query.id + '%');
      //  console.log(query);
    }

    sql.query(query, function(err, data) {
        if (err) return error(res, 'failed to run the query', err);

        res.json(data);

    });

});

///////////////////////////////////////////////////////////////////
// delete from DB
app.delete('/api/notes/:id', deleteNote);
app.delete('/api/delEvent/:id', deleteEvent);


// static files - change to non static
app.use('/', express.static(webpage, {
    extensions: ['html']
}));


app.listen(8080, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8080/');

function error(res, msg, error) {
    res.sendStatus(500);
    console.error(msg, error);
}







/* server functions
 *
 *
 *    ####  ###### #####  #    # ###### #####     ###### #    # #    #  ####  ##### #  ####  #    #  ####
 *   #      #      #    # #    # #      #    #    #      #    # ##   # #    #   #   # #    # ##   # #
 *    ####  #####  #    # #    # #####  #    #    #####  #    # # #  # #        #   # #    # # #  #  ####
 *        # #      #####  #    # #      #####     #      #    # #  # # #        #   # #    # #  # #      #
 *   #    # #      #   #   #  #  #      #   #     #      #    # #   ## #    #   #   # #    # #   ## #    #
 *    ####  ###### #    #   ##   ###### #    #    #       ####  #    #  ####    #   #  ####  #    #  ####
 *
 *
 */

function saveNote(req, res) {
    //add the file to the DB
    console.log('save');
    var event_ = req.body;
    console.log(req.body);

    sql.query(sql.format('INSERT INTO stickyNotes SET ? ', event_), function(err, result) {
        if (err) return error(res, 'failed sql insert', err);
        res.sendStatus(200);

    });
}

function saveEvent(req, res) {
  console.log('save event');
  var event_ = req.body;
  console.log(req.body);

  sql.query(sql.format('INSERT INTO calendar SET ? ', event_), function(err, result) {
      if (err) return error(res, 'failed sql insert', err);
      res.sendStatus(200);

  });
}

function deleteNote(req, res) {

console.log(req.params.id);
console.log();


sql.query(sql.format('DELETE FROM stickyNotes WHERE id=?', [req.params.id]), function (err, result) {
  if (err) return error(res, 'failed sql delete', err);

});
}

function deleteEvent(req, res) {

  //console.log(req.params.id);


  sql.query(sql.format('DELETE FROM calendar WHERE id=?', [req.params.id]), function (err, result) {
    if (err) return error(res, 'failed sql delete', err);

  });

}
