var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var moment = require('moment');
var monk = require('monk');
var db = monk('localhost:27017/codeheat');
var col = db.get('user');
var signup = db.get('signup');
/* GET home page. */
router.get('/home', function(req,res){
  res.render('index');
});

router.get('/', function(req,res){
  res.render('login');
});

router.get('/birthday', function(req,res){
  res.render('birthday');
})

router.get('/logout', function(req,res){
  res.redirect('/');
});

router.get('/forgot', function(req,res){
  res.render('forgot');
});

router.get('/getuser', function(req, res) {
  col.find({}, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  })
});

router.post('/postuser', function(req,res){
  //console.log(req.body);
  col.insert(req.body, function(err,docs){
  	if(err){
  		console.log(err);
  	}
  	else{
  		//console.log(docs);
  		res.send(docs);
  	}
  })
})

router.put('/edituser/:a', function(req,res){
  console.log(req.params.a);
  console.log(req.body);
  col.update({"_id":req.params.a},{$set:req.body}, function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  });
});

router.delete('/deleteuser/:id', function(req,res){
  //console.log(req.params.id)
  col.remove({"_id":req.params.id}, function(err,docs){
    if(err){
      console.log(err);
    }
    else{
      //console.log(docs);
      res.send(docs);
    }
  });
});
//--------------------------------------signup---------------------------------------
router.post('/postsignup', function(req,res){
  signup.insert(req.body, function(err,docs){
    if (err) {
      console.log(err);
    }
    else{
      res.send(docs);
    }
  });
});

router.post('/postlogin', function(req,res){
  var email1 = req.body.email;
  var password1 = req.body.password;
  signup.findOne({"email":email1,"password":password1}, function(err,docs){
    if(docs){
      res.send(docs);
    }
    else{
      res.sendStatus(500);
    }
  });
});
//-------------------------------OTP Email--------------------------------------
router.post('/postforgot', function(req,res){
  var email = req.body.email;
  var newpassword = randomstring.generate(7);
  
  signup.update({"email":email},{$set:{"password":newpassword}});

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandy.sid4u@gmail.com',
    pass: 'jyothsna8'
  }
  });

  var mailOptions = {
    from: 'Sandeep Siva',
    to: email,
    subject: 'OTP',
    text: 'Your OTP is'+newpassword
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent');
      res.send(info);
    }
  });
});
//----------------------------------birthday mail--------------------------
router.post('/postbirthday', function(req,res){
  var bdate = moment(req.body.dob).format('DD-MM');
  console.log(bdate);
  // var Time = moment().format('hh:mm:ss:a');
  // console.log(Time);
  var Date = moment().format('DD-MM');
  console.log(Date);
  if(bdate==Date){
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pm961.cse@gmail.com',
      pass: 'prasad961@cse'
    }
    });

    var mailOptions = {
      from: 'Sandeep Siva',
      to: req.body.email,
      subject: 'Birthday Wishes',
      text: 'Hi' +req.body.name+ 'Happy Birthday'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent');
        res.send(info);
      }
    });
  }
});
module.exports = router;
