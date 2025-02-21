const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    responseValue:{  // este es el texto o numero que el usuario elige
        type: String,
    },
    nextId:{  // id del siguiente mensaje a mostrar
        type: String,
    }
})

const MessageSchema = new mongoose.Schema({
    messageText:{  // texto del mensaje a mostrar
        type: String,
        required: true,
    },
    messageId:{  // identifica a este mensaje frente a otros mensajes, por medio del campo next_id
        type: String,
        required: true,
    },
    doAction:{  // ejecuta una funcion cuando se renderiza
        type: String,
    },
    messageOptions:{  // almacena las opciones y los mensajes a donde va a ir 
        type: [OptionSchema]
    }

})

const MessageData = mongoose.model('Message', MessageSchema);

module.exports = MessageData;