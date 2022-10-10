//es para asegurar las rutas
//un middlewar es una funcion que se ejecuta dependiendo de lo que pasemos
//entonces para corroborar si existe una sesion o no
// este is Autenticated es una funcion que tiene passport
//si el usuario se ha logueado me devuevle true
//sino me devuelve false
export const isAuthenticated = (req, res, next) => {
  //esta es la funcion, pero para utilizarla lo debo hacer en las rutas de las notas
  if (req.isAuthenticated()) {
    return next();
    //si me da true, se ejecuta el next que permite que se siga desarrollando la aplicacion
  }
  req.flash("error_msg", "Not Authorized.");
  res.redirect("/users/signin");
};
