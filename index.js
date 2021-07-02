const express = require('express');
const app = express(); //creates a server
const bookModel = require('./mongo-conn/dbsetup.js');

const cors = require('cors');
const { validate, ValidationError, Joi } = require('express-validation')
app.use(express.json()) // for parsing application/json
app.use(cors());

const bookValidation = {
  body:  Joi.object({
    bookName: Joi.string()
        .required(),

        price: Joi.number()
        .integer()
        .min(100)
        .max(1000),

        language: Joi.string()
        .required(),

        author: Joi.string()
        .required(),
        aboutAuthor: Joi.string()
        .required()
    
})
}

//insert data
app.post('/book/add',validate(bookValidation, {keyByField: true }, {}), (req, res) => {
    console.log("route", req.params)
    console.log(req.params);
    const data = req.body;
    const book = new bookModel(data);
    book.save().then((save) => {
        console.log("data saved successfully");
        res.send(save);
    }).catch((error) => {
        console.log("data is not saved");
        if (data.bookName) {
            bookModel.findOne().where({ bookName: data.bookName.toLowerCase() })
                .then((data) => {
                    console.log(data);
                    console.log("book with same name is already there")
                    res.status(409).send("book with same name is already there")
                })
                .catch((err) => res.status(400).send("unable to add book inner"))
        }
        else {
            res.status(500).send("unable to add book")
        }

    });

});
app.use(function(err, req, res, next) {
    console.log("ERrrorrrrr--")
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
  
    return res.status(500).json(err)
  })
//update data
app.put('/book/update', (req, res) => {
    console.log("route", req.query)
    const body = req.body;
    const query = req.query;
    console.log("Language", body);
    const book = new bookModel(body);

    if (req.query.book && Object.keys(req.body).length > 0) {
        bookModel.where({ bookName: req.query.book }).findOne()
            .then((data) => {
                console.log("available data", data);
                if (data != null) {
                    bookModel.updateOne({ bookName: query.book }, { language: body.language }, (error, docs) => {
                        if (error) {
                            console.log(error)
                            res.status(400).send("Error")
                        }
                        else {
                            console.log("Updated Docs : ", docs);
                            res.status(200).send(docs.nModified + "data updated")
                        }
                    })
                }
                else {
                    res.status(400).send("Unable to find book")
                }

            })
            .catch((err) => res.status(400).send("unable find given book in database"))
    }
    else {
        if (Object.keys(req.body).length < 1) {
            res.status(400).send("Bad Request Please provide body")
        }
        else {
            res.status(400).send("Bad Request Please provide book query")
        }

    }

});

//find bookby bookname
app.get('/book/find', (req, res) => {
    console.log(req.query.book);

    const book = req.query.book;
    if (book) {
        bookModel.where({ bookName: req.query.book }).findOne()
            .then((data) => {
                if(data){
                    res.status(200).send(data);
                }
                else{
                    res.status(404).send("No data found for this book");
                }
                
            })
            .catch((error) => {
                console.log("error", error)
                res.status(404).send("Error No data found");
            });
    }
    else {
        res.status(404);
        res.send("please specify valid book name");
    }

});

//find all book
app.get('/findallbook', (req, res) => {
   
        bookModel.find()
            .then((data) => {
                if(data){
                    res.status(200).send(data);
                }
                else{
                    res.status(404).send("No data found for this book");
                }
                
            })
            .catch((error) => {
                console.log("error", error)
                res.status(404).send("Error No data found");
            });
    }
)
//delete by book Name
app.delete('/book/delete', (req, res) => {
   
    console.log(req.query.book);

    const book = req.query.book;
    if (book) {
        bookModel.deleteOne({ bookName: req.query.book})
            .then((data) => {
                console.log(data);
                if(data.deletedCount>0 ){
                    res.status(200).send(data.deletedCount+"data deleted  sucessfully");
                }
                else{
                    data.n>0?res.status(400).send(data.deletedCount+"unable to delete"):res.status(404).send("No data Found");;
                }      
            })
            .catch((error) => {
                console.log("error", error)
                res.status(404).send("Error No data found");
            });
    }
    else {
        res.status(404);
        res.send("please specify valid book name");
    }

    }
)


//assign port
app.listen(8888, () => console.log('server started at 8888'));