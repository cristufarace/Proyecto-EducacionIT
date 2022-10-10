//CONTIENE las rutas para realizar CRUD con MONGOdb , renderizar vistas.hbs y realizar redirrecciones.


import { Router } from "express";
// importa funcion que me permite saber si la persona se autentico y consecuencia permiterle el acceso a determiandas vistas y rutas
import { isAuthenticated } from "../helpers/auth.js";
//importo modelo de transaccion de mongo
import transaccion from "../models/transaccion.js";

//Funcion que renderiza la vista new-transaccion.hbs que contiene formulario para crar una transaccion
const rendertransaccionForm = (req, res) =>
  res.render("transaccion/new-transaccion");

//-Funcion que es ejecutada luego del evento submit- 
//Esta Funcion hace un CREATE de la transaccion de un usuario en particular en Mongo y luego renderiza vista all-transaccion.hbs con esas transacciones
const createNewtransaccion = async (req, res) => {
  const { tipo, monto, description } = req.body;
  const errors = [];
  if (!tipo) {
    errors.push({ text: "Please Write a tipe." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0)
    return res.render("transaccion/new-transaccion", {
       //si hay errores que mostrar vuelvo a renderizar la vista que se esta mostrando pero con los errores
      errors,
      tipo,
      description,
      monto,
    });

  const newtransaccion = new transaccion({ tipo, monto, description });
  newtransaccion.user = req.user.id;
  //A SU VEZ, CADA VEZ QUE SE GUARDA UNA TRANSACCION SE VA A GUARDAR CON EL ID DEL USUARIO QUE SE CREO AL PASAR AUTENTICACION, ESTE ID LO ALMACENE EN UNA SESION PARA NO ESTAR PIDIENDOLE LOS DATOS AL USUARIO A CADA RATO
  await newtransaccion.save();
  //cada transacccion que se guarda, se va a guardar con el id del usuario que se logueo
  req.flash("success_msg", "Transaccion registrada de forma correcta");
  res.redirect("/transaccion");
};

//Funcion que hace un GET de las transacciones de un usuario en particular en Mongo y luego renderiza vista all-transaccion.hbs con esas transacciones
const rendertransaccion = async (req, res) => {
  const transaccions = await transaccion
    .find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("transaccion/all-transaccion", { transaccions });
};

//Funcion que renderiza vista edit-transaccion.hbs con formulario para editar, tambien lo que hace capturar el id de la transaccion que se quiere modificar, para eso la va a buscar a la base de datos, una vez que la obtiene, renderiza el formulario para modificarla al cual le pasa como propiedad un objeto con los datos a modificar
const renderEditForm = async (req, res) => {
  const transaccions = await transaccion.findById(req.params.id).lean();
  if (transaccions.user != req.user.id) {
    req.flash("error_msg", "No estas autorizado para ingresar en esta ruta");
    return res.redirect("/transaccion");
  }
  res.render("transaccion/edit-transaccion", { transaccions });
};

//Funcion que hace un UPDATE  de una transaccion en particular en Mongo y luego renderiza vista all-transaccion.hbs con todas las transacciones
const updatetransaccion = async (req, res) => {
  const { tipo, monto, description } = req.body;
  await transaccion.findByIdAndUpdate(req.params.id, {
    tipo,
    monto,
    description,
  });
  req.flash("success_msg", "Transaccion actualizada de forma correcta");
  res.redirect("/transaccion");
};

//Funcion que hace un DELETE  de una transaccion en particular en Mongo y luego renderiza vista all-transaccion.hbs con todas las transacciones
const deletetransaccion = async (req, res) => {
  await transaccion.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Transaccion eliminada de forma correcta");
  res.redirect("/transaccion");
};


//NOTA: Antes de acceder a cada una de las rutas que estan definidas, express controla que el usuario este autenticado.
// Cuando se visite tal ruta, con tal metodo, ejecuta tal funcion
const router = Router();

//-------RENDERIZA------- un hbs con el fromualrio para crear una nueva transaccion
router.get("/transaccion/add", isAuthenticated, rendertransaccionForm);

// ------RENDERIZA------- un hbs con el fromualrio para editar la transaccion
router.get("/transaccion/edit/:id", isAuthenticated, renderEditForm);

//(CREATE) Ruta que se conecta a mongo y crea un documento con los datos de la transaccion
router.post("/transaccion/new-transaccion",isAuthenticated,createNewtransaccion);

// (READ) Ruta que  se conecta a mongo, hace un get, obtiene todas las transacciones y -------RENDERIZA------- un hbs con todas las transacciones
router.get("/transaccion", isAuthenticated, rendertransaccion);

//(UPTADATE) Ruta que se conecta a mongo y actualiza un documento especifico
router.put(
  "/transaccion/edit-transaccion/:id",  isAuthenticated, updatetransaccion);

//(DELETE) Ruta que se conecta a mongo y elimina un documento especifico
router.delete("/transaccion/delete/:id", isAuthenticated, deletetransaccion);


//exporto las rutas para luego importarlas en el componente principal app y poder hacer uso de las mismas
export default router;
