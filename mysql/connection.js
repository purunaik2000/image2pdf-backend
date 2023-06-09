const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
var mysql      = require('mysql');
// Dev-connection
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'password',
//   database : 'img2pdf'
// });

// Prod-connection
var connection = mysql.createConnection({
  host     : 'image-to-pdf-database.cytvbvbmlzrr.ap-south-1.rds.amazonaws.com',
  user     : 'admin',
  password : process.env.DATABASE_PASS,
  database : 'img2pdf'
});
 
connection.connect(err=>{
  if(err) console.log(err.message);
});
 
module.exports = connection;
// connection.end();