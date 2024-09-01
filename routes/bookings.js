const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const {main} = require('../config/sendMail');


const {User} = require('../models/user');


const BookingSchema = new mongoose.Schema({
    studentName: String,
    email:String,
    rollno:String,
    courtNumber: Number,
    timeSlot: String,
    selectedDate:{type:Date},
    status: String,
    bookingDate: { type: Date, default: Date.now },
    bookingId:String,
  });
  
  const Booking = mongoose.model('Booking', BookingSchema);
  
  // API Endpoints
  router.get('/bookings',requireLogin, (req, res) => {
    Booking.find()
      .then((bookings) => res.json(bookings))
      .catch((err) => res.status(400).json({ error: err.message }));
  });
  

  router.put("/user/")


 
  router.post('/bookings', requireLogin, async (req, res) => {
    const { courtNumber, selectedDate, timeSlot, bookingId } = req.body;
    const userId = req.user._id;
  
    try {

      //console.log("error occuring here")
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const currentDate = new Date();

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
      const year = currentDate.getFullYear();

      const newBooking = new Booking({
        student_roll_no: user.name,
        email:user.email,
        rollno: user.rollno,
        courtNumber,
        timeSlot,
        selectedDate,
        status: 'Pending',
        bookingDate: new Date(),
        bookingId,
        userEmail: user.email // Add the userEmail field to store the email ID
      });
  
      await newBooking.save();
      return res.json(newBooking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });
  
  
  //get booking by bookingId
  router.get('/bookings/:bookId',requireLogin,async (req, res) => {
  
    console.log(req.params.bookId);
    let obj = await Booking.findOne({bookingId:req.params.bookId});
    //console.log("object : "+obj);
  
    return res.send(obj);
  })
  
  
  router.put('/bookings/:id',(req, res) => {
    Booking.findByIdAndUpdate(req.params.id, { status: req.body.status })
      .then(() => res.json({ message: 'Booking updated!' }))
      .catch((err) => res.status(400).json({ error: err.message }));
  });


  router.get('/bookingsById/:id',async (req, res) => {

    try {
      // Use findById to find a document by its _id
      const foundBooking = await Booking.findById(req.params.id);
  
      if (foundBooking) {
        console.log('Found Booking:', foundBooking);
        return res.json(foundBooking);
      } else {
         console.log('Booking not found');
         return res.send("not found");
      }
    } catch (error) {
      console.error('Error finding booking by ID:', error);
      return res.send("error found");
    }


  });


  
  router.delete('/bookings/:id',requireLogin, (req, res) => {
    Booking.findByIdAndDelete(req.params.id)
      .then(() => res.json({ message: 'Booking deleted!' }))
      .catch((err) => res.status(400).json({ error: err.message }));
  });



  router.get('/bookingsByDate/:email',async (req,res) => {

    const email = req.params.email;
    console.log(email)

    let bookings = await Booking.find({email:email});
    let curDate = new Date();



    for(let i=0;i<bookings.length;i++){
  
      // console.log(bookings[i].bookingDate.getFullYear() +
      // " " +curDate.getFullYear())
      // console.log(bookings[i].bookingDate.getMonth() +" "+ curDate.getMonth())
      // console.log(bookings[i].bookingDate.getDate() +" "+ curDate.getDate())

      // console.log("next")

      if(bookings[i].bookingDate.getFullYear() == curDate.getFullYear()
        && bookings[i].bookingDate.getMonth() == curDate.getMonth()
        && bookings[i].bookingDate.getDate() == curDate.getDate()){
          
          return res.json({canBook:false});

        } 

    }

    res.json({canBook:true});


  })


  router.post("/bookingstatus",(req,res) => {

    const {destination,message,subject} = req.body;
    
    try{
      main(destination,message,subject);
      res.json({"status":"success"})
    }
    catch{
      res.json("Errror");
    }
    

  })



module.exports = router