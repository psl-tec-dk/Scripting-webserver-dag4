const mysql = require("mysql2");
const config = require("../config/dbconfig.json");


/**
 * pool.execute() kan i nogle tilfælde fejle _UDEN_ at fejlen
 * fanges i en try - catch struktur. Det ser ud til at der er en bug
 * i 'node_modules/mysql/lib/pool.js' på linie 177
 * Linien ændres: 
 *      fra: throw e; 
 *      til: return cb(e);
 * 
 */

let pool;
try {
    pool = mysql.createPool(config);
}
catch(err) {
    console.log(err);
}


// let conn;
// const connect = async () => {
//     conn = await mysql.createConnection(config);
// }

exports.getAll = () => {
    // await connect();
    return new Promise((succes, failure) => {
        const sql = "select * from tblapi order by fullname";
        pool.execute(sql, (err, rows) => {
            if(err) {
                failure(err);
                return;
            }
            succes(rows);
        });
    });
}

exports.getById = id => {
    // await connect();
    return new Promise((succes, failure) => {
        const sql = "select * from tblapi where id = ? order by fullname";
        pool.execute(sql, [id], (err, rows) => {
            if(err) {
                failure(err);
                return;
            }
            succes(rows);
        });
    });
}

exports.insert = jsonData => {
    // await connect()
    return new Promise((succes, failure) => {
        const sql = "insert into tblapi (fullname, email, student) values(?, ?, ?)";
        try {
            pool.execute(sql, [jsonData.fullname, jsonData.email, jsonData.student], (err, result) => {
                if(err) {
                    failure(err);
                    return;
                }
                succes(result);
            });
        }
        catch(err){
            console.log(err);
            failure(err);
        }
    });
}

exports.update = (id, jsonData) => {
    // await connect()
    return new Promise((succes, failure) => {
        const sql = "update tblapi set fullname = ?, email = ?, student = ? where id = ?";
        pool.execute(sql, [jsonData.fullname, jsonData.email, jsonData.student, id], (err, result) => {
            if(err) {
                failure(err);
                return;
            }
            succes(result);
        });
    });
}

exports.delete = (id) => {
    // await connect()
    return new Promise((succes, failure) => {
        const sql = "delete from tblapi where id = ?";
        pool.execute(sql, [id], (err, result) => {
            if(err){
                failure(err);
                return;
            }
            succes(result);
        });
    });
}