var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var mongoHeadlineSchema = Schema({
	title: {
		type: String,
		required: true,
		unique: true 
	},
	imgURL: {
		type: String,
		required: true
	},
	synopsis: {
		type: String,
		required: true
	},
	articleURL: {
		type: String,
		required: true
	},
	comments: [{
		text: {
			type: String 
		}
	}]
});

var MongoHeadline = mongoose.model('ScrapedData', mongoHeadlineSchema);

module.exports = MongoHeadline;