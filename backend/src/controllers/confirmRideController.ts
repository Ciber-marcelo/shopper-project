import { Request, Response } from 'express';
import { drivers } from '../drivers';
import { rides } from '../rides';

export const confirmRideController = (req: Request, res: Response) => {
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
    origin: origin,
    destination: destination,
    distance,
    duration,
    driver: selectedDriver,
    value
  };

  rides.push(newRide);

  res.status(200).json({
    success: true,
  });
}