import express, { Request, Response } from 'express';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
import { drivers } from './drivers';

dotenv.config(); // Carrega as variáveis de ambiente (.env)

const app = express();
const PORT = 8080;
const rides: any = []
const client = new Client({}); // Inicialize o cliente do Google Maps

app.use(express.json()); // Middleware para JSON

// Rota inicial
app.get('/', (req: Request, res: Response) => {
  res.send(`API está rodando!`);
});

// Endpoint para realizar os cálculos dos valores da viagem
app.post('/ride/estimate', async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination || origin === destination) {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
    });
    return;
  }

  try {
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_API_KEY as string,
      },
      timeout: 10000,
    });

    const route = response.data.routes[0];
    const leg = route.legs[0];

    const originLocationLat = leg.start_location.lat; // latitude origen
    const originLocationLng = leg.start_location.lng; // longitude origen
    const destinationLocationLat = leg.end_location.lat; // latitude destino
    const destinationLocationLng = leg.end_location.lng; // longitude destino

    const distanceMeters = route.legs[0].distance.value; // distância em metros
    const durationTime = route.legs[0].duration.text; // tempo de duração (string)

    // Aqui estou filtrando os motoristas e Calculando o valor da corrida de cada um deles
    const availableDrivers = drivers
      .filter((driver) => distanceMeters / 1000 >= driver.minKM) // Filtra os motoristas pela quilometragem mínima
      .map((driver) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.review,
        value: distanceMeters / 1000 * driver.value // Calcula o valor estimado da corrida
      }));

    res.json({
      origin: { "latitude": originLocationLat, "longitude": originLocationLng },
      destination: { "latitude": destinationLocationLat, "longitude": destinationLocationLng },
      distance: distanceMeters,
      duration: durationTime,
      options: availableDrivers,
      routeResponse: response.data
    });
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    res.status(500).json({ error: 'Erro ao calcular rota.' });
  }
});

// Endpoint para confirmar a viagem e gravá-la no histórico
app.patch('/ride/confirm', (req: Request, res: Response) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (!customer_id || !origin || !destination || !distance || !duration || !driver || !value || origin === destination) {
    res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
    });
    return;
  }

  const selectedDriver = drivers.find((d) => d.id === driver.id && d.name === driver.name);

  if (!selectedDriver) {
    res.status(404).json({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: 'Motorista não encontrado'
    });
    return;
  }

  if (distance / 1000 < selectedDriver.minKM) {
    res.status(406).json({
      error_code: 'INVALID_DISTANCE',
      error_description: 'Quilometragem inválida para o motorista'
    });
    return;
  }

  //Aqui estou salvando os dados da viagem no array "rides" simulando um banco de dados
  const newRide = {
    id: rides.length + 1,
    customer_id,
    date: new Date(),
    origin,
    destination,
    distance,
    duration,
    driver: selectedDriver,
    value
  };

  rides.push(newRide);

  res.status(200).json({
    success: true,
  });
});

// Endpoint para listar as viagens realizadas por um deteerminado usuario
app.get('/ride/:customer_id', (req: Request, res: Response) => {
  const { customer_id } = req.params;
  const { driver_id } = req.query;

  if (driver_id) {
    const driverExists = drivers.some((d) => d.id === Number(driver_id));
    if (!driverExists) {
      res.status(400).json({
        error_code: 'INVALID_DRIVER',
        error_description: 'Motorista invalido'
      });
      return;
    }
  }

  let userRides = rides.filter((ride: any) => ride.customer_id === customer_id);

  if (driver_id) {
    userRides = userRides.filter((ride: any) => ride.driver.id === Number(driver_id));
  }

  if (userRides.length === 0) {
    res.status(404).json({
      error_code: 'NO_RIDES_FOUND',
      error_description: 'Nenhum registro encontrado'
    });
    return;
  }

  // Ordena as viagens da mais recente para a mais antiga
  userRides.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.status(200).json({
    customer_id: customer_id,
    rides: userRides.map((ride: any) => ({
      id: ride.id,
      date: ride.date,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: { "id": ride.driver.id, "name": ride.driver.name },
      value: ride.value
    })),
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
