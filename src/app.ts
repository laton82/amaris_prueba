import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
const bodyParser = require('body-parser');
const mongoPassword = process.env.MONGO_PASS; 
const appConfig = process.env.APP_CONFIG;

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

app.get('/webhook', (req, res) => {
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

app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log(JSON.stringify(data,null,2));
  res.status(200).send('ok');
});


app.listen(port, ()=>{
  console.log("activo");
});

