import Mysql from "mysql";

const db_credentials = {
    host: "192.168.100.79",
    user: "docker",
    password: "Docker123",
    database: "the_wall"
};

let connection = Mysql.createConnection(db_credentials);

connection.connect(function(error){
    if(error){
        throw error;
    }
});

module.exports = connection;