import { Router } from "express";
// importo el modelo de usuario con sus 2 metodos, el primero encripta la contraesña ingresada y el segundo metodo compara la contraseña ya cifrada con la del formulario de logueo
import User from "../models/User.js";
import passport from "passport";



//CONTIENE LAS RUTAS PARA:
// 1-CREARSE UN USUARIO
// 2-LOGUEARSE
// 3-VERIFICAR SI EL USUARIO QUE QUIRE ACCEDER A LA APLIACION ESTA REGISTRADO, SI NO ESTA REGITRADO Y REDIRECCIONARLO A CREARSE UN USUARIO

// Funcion que renderiza vista singup.hbs para registrarse
const renderSignUpForm = (req, res) => res.render("auth/signup");

// Funcion que verifica que exista el usuario en la base de datos de mongo, ¿como? utilizando el metodo findOne
const singup = async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    errors.push({ text: "La contraseña no coincide." });
  }

  if (password.length < 4) {
    errors.push({ text: "La contraseña debe tener al menos 4 caracteres" });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", { 
      //si hay errores que mostrar vuelvo a renderizar la vista que se esta mostrando pero con los errores
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  }

  // Si las contraseñas estan bien, ahora tengo que chequear que el mail que me da no este en uso
  const userFound = await User.findOne({ email: email });
  if (userFound) {
    req.flash("error_msg", "El Mail ya esta en uso ");
    return res.redirect("/auth/signup");
  }

  // Si el mail no esta en uso y no hay errores, creo un usuario nuevo, encripyp la contraseña y lo redirecciono a la vista para ingresar a la app
  const newUser = new User({ name, email, password });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();
  req.flash("success_msg", "Ahora estas registrado");
  res.redirect("/auth/signin");
};

// Funcion que renderiza vista singup.hbs para ingresar
const renderSigninForm = (req, res) => res.render("auth/signin");

// Funcion que ejecuta la estrategia de autenticacion local
const signin = passport.authenticate("local", {
  successRedirect: "/transaccion", //si la autenticacion sale bien, lo redireccion a las notas
  failureRedirect: "/auth/signin", //si no sale bien, lo redirecciono para que vuelva aingresar 
  failureFlash: true, //esta linea sirve para poder enviarle mensajes entre la autenticacion
});

// Funcion que permite salir de la expres sesion
const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "Has salido de la sesion");
    res.redirect("/auth/signin");
  });
};


const router = Router();

// Cuando se visite tal ruta, con tal metodo, ejecuta tal funcion
router.get("/auth/signup", renderSignUpForm);

router.post("/auth/signup", singup);

router.get("/auth/signin", renderSigninForm);

router.post("/auth/signin", signin);

router.get("/auth/logout", logout);

//exporto las rutas para luego importarlas en el componente principal app y poder hacer uso de las mismas
export default router;
