// al igual que las transacciones, voy a tener que crar un esquema desde cero para eso requiero mongoose
import mongoose from "mongoose";
// modulo que me permite encriptar las contraseñas y guardarlas en mi base de datos
import bcrypt from "bcryptjs";

// guarda el esquema de datos en una variable para poder utilizarlo luego
const UserSchema = new mongoose.Schema(
  {//esto es para decirle a mongo db como van a lucir mis datos, 
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Creo 2 metodos para mi modelo de datos

// Metodo 1 -  Recibe una contraseña, y lo que hace es cifrarla con un algoritmo para mayor seguridad. Al igual que una peticion http la operacion la puede hacer de forma asincrona, y es necesario ya que tarda un tiempto en generar la encriptacion
UserSchema.methods.encryptPassword = async (password) => {
  //bcrypt hace la encriptacion 10 veces y cuando termine de hacer la encriptacion me va a devolver un hash
  const salt = await bcrypt.genSalt(10);
  // el hash que me devuelve se lo paso a la contraseña y ahi se genera la contraseña cifrada
  return await bcrypt.hash(password, salt);
};

// Metodo 2 -Vuelvo a cifrar la contraseña para compararla al iniciaar sesion... ¿Porque haria esto? Como hice un cifrado de la contraseña que me da el usuario y la guardo en la base de datos, para que el usuario se pueda loguear en forma posterior, ya que la contraseña que ingreso es distinta a la que guarde en la base de datos, el mismo modulo bcrypt me permite comprar contraseñas (voy a comprar la que ingreso el usuario con la que tengo cifrada en la base de datos).
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
//Para poder utilizar este modelo luego, necesito exportalo. Para eso defino 2 parametros.... 1-el nombre con que guardarlo (user) y 2 el equema  (UserSchema)

