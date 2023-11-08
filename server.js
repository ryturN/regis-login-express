const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./dbconfig/index')
const router = require('./routes/routes')
const auth = require('./routes/auth')
const cookieParser = require("cookie-parser");


// try{
//     dbConfig.authenticate();
//     console.log(`Database Connected...`);
//     dbConfig.sync();
// }catch(err){
//     console.log(err)
// }

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));




const port = 2345
app.use('/',router);

app.listen(port,()=>{
    console.log('server is running on port:' + port)
})

