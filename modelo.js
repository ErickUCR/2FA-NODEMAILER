//dependencia
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
//modelo
let modelo= {};

var hostDB = 'localhost';
var userDB = 'root';
var passDB = '';
var databaseDB = 'prueba';

modelo.inicio = function(nombre1,callback){
    callback(null,{nombre:nombre1,status:"Conectado"})
}
modelo.verificar = function(email,pass,callback){
    var conexion = mysql.createConnection({
        host : hostDB,
        user : userDB,
        password : passDB,
        database : databaseDB
    })
    conexion.connect((err)=>{
        if(err){
            console.log(err);
        }
    });
    if(conexion){
        var consulta = "select * from usuarios where correo='"+email+"'and pass='"+pass+"'";
        conexion.query(consulta, function(err,fila){
            if(err){
                console.log(err);
            }else{
                if(fila.length >= 1)
                {
                    var token = jwt.sign({email: email}, 'claveToken2024');
                    callback(null,{status:"ok",datos: fila, toke: token, mensaje:"Usuario encontrado"});
                }
                else 
                {
                    callback(null,{status:"ok",datos: null, mensaje:"Usuario NO encontrado"});
                }
            }
        });
    }
    conexion.end();
}
modelo.enviarCorreo = function(email,token,callback){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'sanchezlopezjuandaniel722@gmail.com',
            pass: 'pymoctnktxoafnib'
        }
    });
    
    let mailOptions = {
        from: 'sanchezlopezjuandaniel722@gmail.com',
        to: email,
        subject: 'Comfirmacion del correo',
        html: '<p>Has click en el siguiente link <a href="http://localhost:3000/verificarToken?token='+token+'"> Has click aqui </a> </p>'
    }

    transporter.sendMail(mailOptions, (error,info)=>{
        if(error){
            console.log(error)
        }else{
            console.log("Correo enviado exitosamente");
            callback(null,{status:'Ok', mensaje: "Correo enviado exitosamente"})
        }
    })
}

module.exports = modelo;