import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import indexRoutes from "./routes/index.routes.js";
import transaccionRoutes from "./routes/transaccion.routes.js";
import userRoutes from "./routes/auth.routes.js";
import "./config/passport.js";
import mongoose from "mongoose"




//divido el codigo del servidor en varias secciones asi es mas facil leerlo
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//initializations:
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// settings


app.set("views", join(__dirname, "views"));
//set es para establecer algo....
//significa... que le estoy indicando al programa como tiene que hacer para encontrar la carpeta views, hago uso del modulo path qe requeri arriba
//path.join... me permite unir directorios, hay una constante en node llamada (__dirname) que me devuelve la ruta en donde se esta ejecutando determinado archivo... ejmplo si ejecuto index me devuelve la carpeta src y al devolverme la carpeta src lo puedo concatenar con otra, por ej views basicamente........ app.set ('views', path.join (__dirname, 'views')) esa linea de codigo me sirve para decirle a node donde se encuentra la carpeta views.

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//settings : aca van todas las configuraciones, ej donde estan las vistas, configurar el motor de plantillas, etc   .set = "crear configuracion"
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
});
//configuro handlebars.... El . y lo que sigue indica como se van a llamar las vistas por ej podria ponerle .html pero para saber que son archivos de handlebars le pongo .hbs
//le digue el exphbs q como es una funcion la voy a ajecutar y adentro le voy a dar un objeto de configuracion que tiene algunas propiedaes, como por ejemplo , (defaultlayout, layoutDir, partialsDir y extname) ¿ para que sirven? - para saber e que manera voy a utilizar las vistas, por ejemplo voy a tener muchos arvhico html que voy a enviar al navegador y todos esos arvhivos van a tener cosas en comun.... por ej una navegacion que se va a repetir en todas las vistas, entonces para no estar repitiendo el codigo en todos los archivos utilizo una especie de MARCO O PLANTILLA, donde voy a colocar mi diseño principal y luego las partes que van a cambiar
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//middelewars: aca van todas las funciones que seran ejecutadas antes de que lleguen al servidor o antes de pasarselas a las rutas
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// configuraciones para que funcione la autenticacion y las sesiones creadas en config passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//variables globales: aca coloco los datos que quiero que toda mi aplicacion tenga acceso
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Routes : rutas, urls ej /login /register /transacciones etc...
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(indexRoutes);
app.use(userRoutes);
app.use(transaccionRoutes);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//static files: configuro donde estaran los archivos estaticos
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.static(join(__dirname, "public")));
//le digo a express que use archivos estaticos y pra eso le digo que una el directorio actual (__dirname) con la carpeta public, establezco la ruta para express encuentre la carpeta public


app.use((req, res) => {
  res.render("404");
});

export default app;

mongoose.connect ("mongodb+srv://usuario:contraseña@cluster0.war4lia.mongodb.net/?retryWrites=true&w=majority")
// tengoo que arreglar esto nada mas, proque solo anda si pongo la uri aca, onda visible para todos, no me toma el .env
.then (()=> {console.log ("Conectado a la base de datos MONGODB de forma exitosa")})
.catch ((err)=> {console.log ("error", err)}) 


//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
// server is listening
app.listen (port, ()=> console.log("Servidor corriendo en el puerto",port))
