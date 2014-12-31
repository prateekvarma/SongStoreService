var cradle = require('cradle');
var c = new(cradle.Connection);
var db = c.database('songstoredb');

function songCreate(req, res) {
	if (!req.body.name) {
		res.status(400).send({error: 'Invalid input. Missing parameter: name.'});
		return;
	} else if (!req.body.artist) {
		res.status(400).send({error: 'Invalid input. Missing parameter: artist.'});
		return;
	} else if (!req.body.album) {
		res.status(400).send({error: 'Invalid input. Missing parameter: album.'});
		return;
	}
	db.save(
		{ name : req.body.name, artist : req.body.artist, album : req.body.album },
  		function (err, response) {
      		if (err){
      			console.log('Problem saving document', err);
				logError(response, err);
      		} else {
      			var new_doc = {
      				_id    : response._id,
      				_rev   : response._rev,
      				name   : req.body.name,
      				artist : req.body.artist,
      				album  : req.body.album
      			};
      			res.status(201).send(new_doc);
      		}
  		}
  	);
}

function songRead(req, res) {
	db.get(req.params.id, function (err, doc) {
		if (err){
			console.log('Problem getting document "'+req.params.id+'"', err);
			logError(doc, err);
		} else {
			res.status(201).send(doc);
		}
  	});
}

function songReadAll(req, res) {
	db.view('songs/all', function (err, response) {
		if (err){
			console.log('Problem getting all songs', err);
			logError(response, err);
		} else {
			var result_set = [];
      		response.forEach(function (row) {
	        	result_set.push(row);
      		});
      		res.send(result_set);
		}
  	});
}

function songUpdate(req, res) {
	if (!req.body._id) {
		res.status(400).send({error: 'Invalid input. Missing parameter: _id.'});
		return;
	} else if (!req.body._rev) {
		res.status(400).send({error: 'Invalid input. Missing parameter: _rev.'});
		return;
	} else if (!req.body.name) {
		res.status(400).send({error: 'Invalid input. Missing parameter: name.'});
		return;
	} else if (!req.body.artist) {
		res.status(400).send({error: 'Invalid input. Missing parameter: artist.'});
		return;
	} else if (!req.body.album) {
		res.status(400).send({error: 'Invalid input. Missing parameter: album.'});
		return;
	}
	db.save(
		req.body._id,
		req.body._rev,
		{
      		_id    : req.body._id,
      		_rev   : req.body._rev,
      		name   : req.body.name,
      		artist : req.body.artist,
      		album  : req.body.album
		},
		function (err, response) {
      		// Handle response
      		if (err){
      			console.log('Problem saving document', err);
				logError(response, err);
      		} else {
      			res.status(201).send(response);
      		}
  		}
  	);
}

function songDelete(req, res) {
	if (!req.params.id) {
		res.status(400).send({error: 'Invalid input. Missing parameter: _id.'});
		return;
	} else if (!req.params.rev) {
		res.status(400).send({error: 'Invalid input. Missing parameter: _rev.'});
		return;
	}
	db.get(req.params.id, function (get_err, doc) {
		if (get_err){
			console.log('Problem getting document "'+req.params.id+'"', get_err);
			res.status(404).send({error: 'Document not found.'});
		} else {
			db.remove(req.params.id, req.params.rev, function (del_err, response) {
				if (del_err) {
					console.log('Problem deleting document "'+req.params.id+'"', del_err);
					logError(response,del_err);
				} else {
      				res.send(response);
				}
  			});
		}
  	});
}

function logError(res, err) {
	res.status(500).send({error: 'Unexpected Error: ' + err});
	throw err;
}