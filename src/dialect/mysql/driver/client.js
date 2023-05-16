const mysql = require('mysql2')
module.exports = options => {
    const connection = mysql.createConnection(options)
    return {
        execute: async (sql) => {
            return new Promise((resolve, reject) => {
                connection.execute(sql, function (error, results){
                    if(error){
                        reject(error)
                    }else if(results){
                        resolve(results)
                    }
                })
            })
        },
        shutdown: () => {connection.destroy()}
    }
}