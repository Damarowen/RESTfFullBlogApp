var port = 5000;

var express = require("express");
app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override")
var expressSanitizer = require('express-sanitizer');


app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(expressSanitizer())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(expressSanitizer());
app.use(methodOverride("_method"))


mongoose.set('useFindAndModify', false);//supaya ga error untuk findByidAndUpdate nya

mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to Monggo DB!')) ///promise java
    .catch(error => console.log(error.message));

var blogSchema = new mongoose.Schema({

    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    } //mengambil tanggal buat secara default
})

var Blog_Model = mongoose.model("Blog", blogSchema)


//home route
app.get("/", function (req, res) {
    res.redirect("/blogs")
})

//BLOG ROUTE
app.get("/blogs", function (req, res) {
    Blog_Model.find({}, function (err, data) {

        if (err) {
            console.log(err)
        } else {
            res.render("index", {
                ejsBlog: data
            })
        }
    })
})

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new")
})


// CREATE ROUTE

app.post("/blogs", function (req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body)//sanitize

    var dataNew = req.body.blog

    Blog_Model.create(dataNew)
        .then(() => res.redirect("/blogs"))
        .catch(error => console.log(error.message))

})

//SHOW ROUTE

app.get("/blogs/:id", function (req, res) {

    var id_data = req.params.id
    Blog_Model.findById(id_data, function (err, data) {
        if (err) {
            res.sender("err")
        } else {
            res.render("show", {
                dari_show: data
            })
        }
    })
})


//PUT or UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {

 req.body.blog.body = req.sanitize(req.body.blog.body)//sanitize

    var data_id = req.params.id
    var data_new = req.body.blog
    Blog_Model.findByIdAndUpdate(data_id, data_new)
        .then(() => res.redirect("/blogs/" + data_id))
        .catch(error => console.log(error.message))


})

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {

    var id_data = req.params.id

    Blog_Model.findByIdAndRemove(id_data)
        .then(() => res.redirect("/blogs"))
        .catch(error => console.log(error.message))

})

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    var id_data = req.params.id
    Blog_Model.findById(id_data, function (err, data) {

        if (err) {
            res.sender(err)
        } else {
            res.render("edit", {
                edit_ejs: data
            })
        }

    })
})


//port server
app.listen(port, function () {
    console.log("server berjalan")
})

