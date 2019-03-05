var mysql = require('mysql');
var path = require('path');
const dbName = 'sqlinj.db';

var HOST = 'localhost';
var USER = 'root';
var PASSWORD = 'toor';

class DatabaseHelper
{
    constructor()
    {
        this.dbConn = mysql.createConnection({host: HOST, user: USER, password: PASSWORD});

        let dbConn = this.dbConn;
        dbConn.connect(function(error) {
            if (error) 
                throw error;
            dbConn.query('use sqlinjproj');
        }); 
    }

    async query(queryString)
    {
        let dbConn = this.dbConn;
        var promise = new Promise(function(resolve, reject){
            dbConn.query(queryString, function (error, result) {
                if (error) reject(error);
                /*sql results come back as RowDataPackets which are essentially the same as regular objects.
                This forces sql results to be turned into regular JSON instead of RowDataPackets */
                result = JSON.parse(JSON.stringify(result)); 
                resolve(result);
              });
        });

        return promise;
    }

    async authenticate(username, password)
    {
        let dbConn = this.dbConn;
        var promise = new Promise(function(resolve, reject){
            dbConn.query('SELECT password FROM Logins WHERE username="' + username + '"', function(error, result){
                if (error) reject(error);
                if (result.length == 0)
                {
                    resolve(false);
                    return;
                }
                if (result[0].password == password)
                {
                    resolve(true);
                    return;
                }
                resolve(false);
            });
        });

        return promise;
    }
}

module.exports = DatabaseHelper;