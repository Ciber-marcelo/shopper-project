import express, { Request, Response } from 'express';
import { estimateRideController } from './controllers/estimateRideController';
import { confirmRideController } from './controllers/confirmRideController';
import { listRidesController } from './controllers/listRidesController';
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Middleware para JSON

// Rota inicial
app.get('/', (req: Request, res: Response) => { res.send(`API está rodando!`) });

// Endpoint para realizar os cálculos dos valores da viagem
app.post('/ride/estimate', estimateRideController);

// Endpoint para confirmar a viagem e gravá-la no histórico
app.patch('/ride/confirm', confirmRideController);

// Endpoint para listar as viagens realizadas por um deteerminado usuario
app.get('/ride/:customer_id', listRidesController);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
