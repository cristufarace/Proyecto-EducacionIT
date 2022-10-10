import { Router } from "express";

//Funcion que renderiza index.hbs
const renderIndex = (req, res) => {
    res.render("index");
  };
//Funcion que renderiza about.hbs
const renderAbout = (req, res) => {
    res.render("about");
  };
//Funcion que renderiza about.hbs
const renderContact = (req, res) => {
    res.render("contact");
  };
  

const router = Router();

// Cuando se visita el dominio a secas, se ejecuta la funcion de arriba que renderiza el index.hbs
router.get("/", renderIndex);
// Cuando se visita el dominio /about, se ejecuta la funcion de arriba que renderiza el about.hbs
router.get("/about", renderAbout);
// Cuando se visita el dominio /about, se ejecuta la funcion de arriba que renderiza el contact.hbs
router.get("/contact", renderContact);

//exporto las rutas para luego importarlas en el componente principal app y poder hacer uso de las mismas
export default router;
