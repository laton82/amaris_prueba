const mongoose = require('mongoose');

const SesionSchema = new mongoose.Schema({
    phoneId: {   // campo "from" del mensaje entrante
        type: String, 
        required: true,
    },
    sesionActive: { // indica si la sesion esta activa 
        type: Boolean,
        default: false, 
    },
    messageId:{  // identificador del mensaje ACTUAL en el modelo de mensajes
        type: String,
        required: true,
    },
    updatedAt: { 
        type: Date
    }, 
});


const Sesion = mongoose.model('Sesion', SesionSchema);

module.exports = Sesion;