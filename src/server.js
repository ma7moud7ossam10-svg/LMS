const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizzesRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const stripeWebhook = require("./stripe.webhook");
const paymentRoutes = require("./routes/paymentRoutes");
const attemptsRoutes = require("./routes/attemptsRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
// express use 
const app = express();
app.use("/api/payments/webhook", stripeWebhook);
app.use(express.json());
//Routes  URL  

// GET , PUT , POST , DELETE 
// TEST URL Genral  
app.get("/",(req, res)=>{
    res.json({
        message :"API its ok"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attempts", attemptsRoutes);
app.use("/api/reviews", reviewRoutes);

// Route don't exit 
app.use ((req, res , next )=>{
const error = new Error(`Route ${req.originalUrl} not found`);
error.status = 404;
next(error);
});
//  error handling 
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
});
const PORT= process.env.PORT||3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!mongoUri) {
    console.error("Set MONGODB_URI or MONGO_URL in .env");
    process.exit(1);
}

mongoose.connect(mongoUri).then(()=> 
{
console.log("Monog connected");
app.listen (PORT,()=>{
    console.log(`server is connected on this ${PORT}`)
});
}).catch ((error )=>
{
    console.log ("database not connected");
    console.error(error);
    process.exitCode = 1;

});
