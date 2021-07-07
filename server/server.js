const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
require('./config/config');

app.use(cors());

//MIDLEWARS
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public/')));

mongoose.connect(process.env.URL_DB, 
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('BASE DE DATOS ONLINE!!');
    }
)


app.get('/', function(req, res) {
    res.send('Hello World')
})

app.listen(3000, () => {
    console.log('Escuchando puerto: ', 3000);
})