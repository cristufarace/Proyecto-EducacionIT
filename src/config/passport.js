// pasport me permite autenticar a un usuario
import passport from "passport";
// la estrategia de autenticacion me permite guardar los datos de ese usuario en una sesion para no estar pidiendoselos a cada momento
import { Strategy as LocalStrategy } from "passport-local";
//requiero la estrategia de autenticacion local y lo guardo en una variable para poder hacer uso
import User from "../models/User.js";
//.use me permite crear una nueva estrategia de autenticacion

// toda esta funcion tiene como finalidad corroborar que los datos del sign in sean los mismos que los que tengo la base de datos
passport.use(
  new LocalStrategy(//yle paso los parametros que voy a solicitar cuando el usuario se quiera autenticar
    {
      usernameField: "email",//es decir a travez de que se va a autenticar el usuario
    },
    async (email, password, done) => {
        //funcion para poder validar el mail dije que iba a ser la forma de autenticar
      //para realizar la autenticacion recibo un email, password y el done es para terminar la autenticacion
      //todos los datos que estoy recibiendo luego los voy a tener que enviar a una ruta
      //UNA VEZ QUE RECIBO TODOS LOS DATOS, tengo que buscar en la misma a ver si existe el usuario, si la contraseña es valida con la que tengo en la base de datos
      //el callback done sirve para terminar el proceso de autenticacion si quiere ingresar con usuario no registrado
      const user = await User.findOne({ email: email });
        //¿una vez que ingresa el mail, como puede terminar (done) la autenticacion?
        //si devuelve null es pq no encontro ningun error
        //si devuelve false es pq no encontro ningun usuario y lo informa a travez del console
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado." });
      }

      //uso el metodo creado desde el modelo de mongoose, llamado matchPassword
      //si encontro el usuario, entonces voy a validar su contraseña y y si es correcta
      //use el callback done y retorno el usuario... en este caso todo habria salido bien
      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return done(null, false, { message: "Contraseña Incorrecta" });
      
      return done(null, user);
    }
  )
);


//si todo lo anterior sale bien tengo que almacenar al usuario en alguna sesion, haría esto para no estar pidiéndole sus datos a cada momento o a cada rato que necesite autenticar algo, para eso:
//si el usuario se loguea de forma correcta, lo que hago es almacenar en una sesion su id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// lo que hace es buscar en la base de datos ese usuario y cerrar la sesion
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
