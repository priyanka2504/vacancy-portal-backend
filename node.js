const express = require('express');
const app = express();
var mongoose = require("mongoose");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, post, options, put, get, patch, delete, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

// mongoose.connect("mongodb://priyanka:priyanka25@ds139775.mlab.com:39775/vacancy");
mongoose.connect("mongodb://localhost:27017/job-vacancy");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var usersSchema = new mongoose.Schema({
    name: String,
    empID: String,
    password: String,
    role: String,
    experience: String,
    location: String,
    technology: String,
    phoneNo: String
});

var jobsSchema = new mongoose.Schema({
    jobID: String,
    jobTitle: String,
    description: String,
    experienceRequired: String,
    jobLocation: String,
    technologies: String,
    PostedOn: String,
    userApplied: Array,
    startingDate: String,
    endingDate: String
});

var appliedJobsSchema = new mongoose.Schema({
    ApppliedJobTitle: String,
    AppliedJobLocation: String,
    AppliedJobTechnology: String,
    userID: String,
    AppliedOn: String,
    jobID: String
});

var user = mongoose.model("users", usersSchema);
var Jobs = mongoose.model("jobs", jobsSchema);
var appliedJobs = mongoose.model("appliedjobs", appliedJobsSchema);

app.get('/users-list', (req, res) => {
    user.find({}, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.get('/all-jobs', (req, res) => {
    Jobs.find({}, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.post('/view-applied-job', (req, res) => {
    appliedJobs.find({ "userID": req.body.userID }, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.post('/view-posted-job', (req, res) => {
    Jobs.find({ "jobID": req.body.jobID }, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.post('/update-applied-user', (req, res) => {
    Jobs.update({ jobTitle: req.body.jobTitle }, { $push: { userApplied: req.body.userApplied } }, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.post('/get-user-details', (req, res) => {
    user.find({ "empID": req.body.empID }, function (err, docs) {
        if (err)
            console.log('error occured in the database');
        res.send(docs);
    });
    return res;
});

app.post('/registered-users', (req, res) => {
    console.log(req.body)
    var myData = new user(
        {
            name: req.body.name,
            empID: req.body.empID,
            password: req.body.password,
            role: req.body.role,
            experience: req.body.experience,
            location: req.body.location,
            technology: req.body.technology,
            phoneNo: req.body.phoneNo
        });
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        })
});

app.post('/post-jobs', (req, res) => {
    var jobs = new Jobs(
        {
            jobID: req.body.jobID,
            jobTitle: req.body.jobTitle,
            description: req.body.description,
            experienceRequired: req.body.experienceRequired,
            jobLocation: req.body.jobLocation,
            technologies: req.body.technologies,
            PostedOn: req.body.PostedOn,
            userApplied: req.body.userApplied,
            startingDate: req.body.startingDate,
            endingDate: req.body.endingDate
        });
    jobs.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        })
});

app.post('/apply-job', (req, res) => {
    var applied = new appliedJobs(
        {
            ApppliedJobTitle: req.body.ApppliedJobTitle,
            AppliedJobLocation: req.body.AppliedJobLocation,
            AppliedJobTechnology: req.body.AppliedJobTechnology,
            userID: req.body.userID,
            AppliedOn: req.body.AppliedOn,
            jobID: req.body.jobID
        });
    applied.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        })
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening ${port}`))