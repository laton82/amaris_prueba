import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/',(req:Request, res: Response) =>{
  res.send('prueba amaris');
});

app.listen(port, ()=>{
  console.log("conectado al puerto 3000 y tantos");
});

