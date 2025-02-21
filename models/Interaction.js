const { timeStamp } = require('console');
const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    phoneId: {   // campo "from" del mensaje entrante
        type: String, 
        required: true,
    },
    incommingMessage:{   // mensaje que envia el usuario
        type: String,
        required: true,
    },
    responseMessage:{  // mensaje de respuesta del bot
        type: String,
        required: true,
    },
    recordTimestamp:{   // timestamp del mensaje entrante
        type: String, 
        required: true
    },
});


const Interaction = mongoose.model('Interaction', InteractionSchema);

module.exports = Interaction;