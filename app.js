module.exports.config = {
	db : {
		host : '127.0.0.1',
		name : 'songstoredb',
	}
};

var config = module.exports.config;

var cradle = require('cradle');
cradle.setup(
	{
    	host: config.db.host,
    	cache: true,
    	raw: false,
    	forceSave: true
	}
);
var c = new(cradle.Connection);
var db = c.database(config.db.name);
  

// initialize app
function start(app, express) {
	db.exists(function (err, exists) {
    	if (err) {
    	  	console.log('Error checking if database exists.', err);
    	} else if (exists) {
      		console.log('Database "'+config.db.name+'" already exists.');
    	} else {
      		console.log('Database does not exists. Creating a new one...');
      		db.create(function(createError){
    			/* do something if there's an error */
    			if (createError)
    				console.log('There was an error trying to create database "'+config.db.name+'".', createError);
  			});
      		console.log('Database "'+config.db.name+'" succesfully created!');
      		/* populate design documents */
      		db.save('_design/songs', {
      			all: {
          			map: function (doc) {
              				if (doc.name) emit(doc.name, doc);
          				 }
      			},
  			});
    	}
  	});
}

// release resources
function stop() {
	process.on('exit', function(e){
		c.close();
	});
	process.on('uncaughtException', function(e){
		c.close();
	});
	process.on('SIGTERM', function(e){
		c.close();
	});
}