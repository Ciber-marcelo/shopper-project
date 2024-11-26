import { Request, Response } from 'express';
import { drivers } from '../drivers';
import { rides } from '../rides';

export const listRidesController = (req: Request, res: Response) => {
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
}