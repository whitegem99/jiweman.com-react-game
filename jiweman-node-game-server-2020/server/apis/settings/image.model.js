var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ImageSchema = Schema({
  url: { type: String },
  base:{type:String},
  name:{type:String}
});

Image = mongoose.model('image', ImageSchema);

module.exports ={
    Image:Image
}