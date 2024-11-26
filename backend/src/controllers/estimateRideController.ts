import { Request, Response } from 'express';
import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';
import { drivers } from '../drivers';

dotenv.config(); // Carrega as variáveis de ambiente (.env)

const client = new Client({}); // Inicialize o cliente do Google Maps

export const estimateRideController = async (req: Request, res: Response) => {
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

      res.status(200).json({
         origin: { "latitude": originLocationLat, "longitude": originLocationLng },
         destination: { "latitude": destinationLocationLat, "longitude": destinationLocationLng },
         distance: distanceMeters,
         duration: durationTime,
         options: availableDrivers,
         routeResponse: response.data
      });
   } catch (error) {
      console.error('Erro ao calcular rota:', error);
      res.status(500).json({ error_description: 'Erro ao calcular rota.' });
   }
}