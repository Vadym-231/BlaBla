
const mySql = require('mysql2/promise');

class sql{
    conn;
    someVar;
    constructor(host,pass,name,db) {
        this.someVar=[];
        this.conn=mySql.createPool({
            host:host,
            user:name,
            database:db,
            password:pass,
            waitForConnections:true,
            connectionLimit:10,
            queueLimit:0
        });
    }
    getConn(){
        return this.conn;
    }
    async sqlQuerry2(str){
        let a =await this.conn.query(str);
        return a;
    }
}


module.exports= {sql};