import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("transaccion", NoteSchema);
//desde mongoose utilizo el modelo, para eso necesito 2 parametros.... 1-el nombre con que guardarlo (transaccion) y 2 el equema  (transaccion)