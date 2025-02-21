import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
const bodyParser = require('body-parser');
const mongoPassword = process.env.MONGO_PASS; 
const appConfig = process.env.APP_CONFIG;
const MessageData = require('../models/Message');
const InteractionData = require('../models/Interaction');
const SesionData = require('../models/Sesion');
if(!mongoPassword || !appConfig){
  throw new Error('variables de entorno no configuradas');
}

let config: { mongo: {user:String, hostString: String } };

try{
  config = JSON.parse(appConfig);
}catch{
  throw new Error('error al parsear variable de entorno');
}
const mongoUrl = `mongodb://${config.mongo.user}:${encodeURIComponent(mongoPassword)}@${config.mongo.hostString}`;

mongoose.connect(mongoUrl).then(() =>{
  console.log('Base de datos conectada');
})
.catch((error)=>{
  console.log('Error de conexion a la base de datos', error);
}) 

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get('/',(req, res) =>{
  res.send('HELOUU...'); 
});

app.get('/webhook', (req, res) => {   /// SI SE ALCANZO A PROBAR EN EL SERVIDOR
  const VERIFY_TOKEN = process.env.WEBHOOK_TOKEN; 
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {  //// ESTA LA FUNCION CONCEPTO  , NO SE HA PROBADO EN EL SERVIDOR tiene un error de typesrcript
  const data = req.body;
  if (data.object === 'whatsapp_business_account') {
    try {
      // Recorrer las entradas del webhook
      for (const entry of data.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const message = change.value.messages[0];
            const phoneId = message.from;  // Número de teléfono
            const text = message.text.body;  // Mensaje 
            let messageModelId = 1;
            const sesionInfo = await SesionData.findOne({ phoneId: phoneId }).select('sesionActive messageId');

            if (sesionInfo) {
              let {sesionActive, messageId} = sesionInfo;
              if(sesionActive === true){
                messageModelId = messageId; // muestra al usuario el mensaje donde habia quedado
              }
            }
            const currentMessageInfo = await MessageData.findOne({messageId: messageModelId});
            if (!currentMessageInfo) {
              return res.status(500).json({ message: 'Modelo de mensaje no encontrado' });
            }
            if(messageModelId != 1){ // valida que no sea el primer mensaje
              const selectedOption = currentMessageInfo.messageOptions.find(
                (option: any) => option.responseValue === text
              );
              if (selectedOption) {
                await SesionData.updateOne(  // Actualizar la sesión con el siguiente mensaje (nextId)
                  { phoneId: phoneId },
                  { messageId: selectedOption.nextId }
                );
                //console.log(`Siguiente mensaje: ${selectedOption.nextId}`);
                const nextMessageInfo = await MessageData.findOne({messageId: messageModelId}).select('messageText');
                sendMessage(phoneId,nextMessageInfo.messageText);
                await InteractionData.create({ // almacena la interaccion actual
                  phoneId: phoneId,  // Número de teléfono del usuario
                  incommingMessage: text,  // Mensaje recibido del usuario
                  responseMessage: currentMessageInfo.messageText,  // Respuesta del bot
                  recordTimestamp: new Date().toISOString(),  // Timestamp actual
                });

              } else {
                // Si no se encuentra la opción, responder con un mensaje de error
                return res.status(400).json({ message: 'Opción no válida' });
              }
            }
          }
        }
      }

      res.status(200).json({ message: 'ok' });
    }catch(error){
    console.error('Error en el webhook:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  res.sendStatus(200);
});



async function endSesion(phoneId: String) { 
  // esta funcion cierra la sesion, esta nombrada en la BD en el estado del mensaje id 3
}

// modelo de función para enviar un mensaje
async function sendMessage(to: string, text: string) {
 /*  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${WHATSAPP_TOKEN}`;

  const data = {
    messaging_product: 'whatsapp',
    to: to,
    text: { body: text },
  };

  try {
    const response = await axios.post(url, data);
    console.log('Mensaje enviado:', response.data);
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response?.data || error.message);
  } */
}



app.listen(port, ()=>{
  console.log("activo");
});

