const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
// const pool = new Pool({
//   // connectionString: 'postgres://{username}:{password}@localhost/users'
//   // connectionString: 'postgres://haochenyang:root@localhost/users'
//   connectionString: process.env.DATABASE_URL
// })
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

let app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.get('/', (req, res) => res.render('pages/mainPage'));
app.get('/', (req,res) => {
  let getRectanglesQuery = `SELECT * FROM rectangle`;
  pool.query(getRectanglesQuery, (error,result) => {
    if (error){
      res.send(error);
    }
    let results = {'rows':result.rows}
    res.render('pages/mainPage', results);
  });
});

app.get('/add', (req,res) => {
  res.render('addRec.ejs');
})

app.post('/add_new', (req,res) => {
  // console.log("req: " + req);
  // console.log("req.body" + req.body);
  let name = req.body.rectangle_name;
  let width = req.body.width;
  let height = req.body.height;
  let color = req.body.color;
  let age = req.body.age;
  let gender = req.body.gender;

  console.log(name,width,height,color,age,gender);
  let addRectangleQuery = `INSERT INTO rectangle VALUES ('${name}', ${width}, ${height}, '${color}', ${age}, '${gender}');`;
  
  pool.query(addRectangleQuery,function(error,results,fields){
    if(error){
      res.send(error);
    } else {
      console.log("Your rectangle added successfully!");
      res.redirect('/');
    }
  });
});

app.get('/delete', (req,res) => {
  console.log("what is wrong?");
  res.render('deleteRec.ejs');
});

app.post('/dele', (req,res) => {
  let name = req.body.recName;
  let deleteQuery = `DELETE FROM rectangle WHERE NAME = '${name}';`;
  pool.query(deleteQuery, function(err, result, fields) {
    //console.log("delet reslut", result)
    if (err) {
      console.log("Failed to delete from Tokimon family")
      res.redirect('/');
    } else {
      if (result.rowCount == 0) {
        console.log("delete 0 rows")
        res.redirect('/');
      } else {
        console.log("success to delete from Tokimon family")
        res.redirect('/');
      }
    }
  });
});

app.post('/display', (req,res) => {
  let name = req.body.name;
  console.log("name: " + name);
  let getRectangleQuery = `SELECT * FROM rectangle WHERE NAME = '${name}';`;
    pool.query(getRectangleQuery, (error, result) => {
        if (error){
          res.end(error);
        }
        let results = { 'rows': result.rows };
        res.render('displayRec.ejs', results)
    });
});

app.get('/update', (req,res) => {
  res.render('updateRec.ejs');
});

app.post('/update', (req,res) => {
  let name = req.body.rec_name;
  let width = req.body.width;
  let height = req.body.height;
  let color = req.body.color;
  let age = req.body.age;
  let gender = req.body.gender;

  console.log(name,width,height,color,age,gender);
  let updateRectangleQuery = `UPDATE rectangle SET WIDTH = ${width}, HEIGHT = ${height}, COLOR = '${color}', AGE = ${age}, GENDER = '${gender}' WHERE NAME = '${name}';`;
  
  pool.query(updateRectangleQuery,function(error,results,fields){
    if(error){
      res.send(error);
    } else {
      console.log("Your rectangle updated successfully!");
      res.redirect('/');
    }
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
