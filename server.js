const express = require('express');
const path = require('path')
const app = express();
const dbConfig = require('./dbconfig/index')
const router = require('./routes/routes')
const auth = require('./routes/auth')


// try{
//     dbConfig.authenticate();
//     console.log(`Database Connected...`);
//     dbConfig.sync();
// }catch(err){
//     console.log(err)
// }

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use('/',router);

app.listen(2345,()=>{
    console.log('server is running on port 2345')
})

