
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating  schema
const bookSchema = new Schema({
  bookName: { type: String ,lowercase:true},
  price: { type: Number },
  language: {type:String},
  author  :{ type : String},
  aboutAuthor: {type:String}
});

//create model to do CRUD Operation
const bookModel = mongoose.model('Library', bookSchema);
mongoose.connect('mongodb+srv://***:******@splitter.yhebt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {  
useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true,
useFindAndModify: false})
  .then((data) => console.log("connection established"))
  .catch((error) => console.log("error while connection splitter", error));

console.log("db Module");

module.exports=bookModel;