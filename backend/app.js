const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bodyParser = require('body-parser');
var cors = require('cors');
const errorHandler = require('./middleware/error');


//import routes
const authRoutes = require('./routes/authroutes');

//db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));

//middlewares   
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
    limit: '5mb', 
    extended: true
}));
app.use(cookieParser());//authentication
app.use(cors()); //request to backend

//routes
app.get('/api', authRoutes);

//error middle ware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`app is running at ${port}`);
});




