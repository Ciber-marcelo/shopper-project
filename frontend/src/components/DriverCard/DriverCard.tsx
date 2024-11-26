import './styles.css';
import { toast } from 'react-toastify';
import Desc from '../Desc/Desc';

type driver = {
   id: number
   name: string
   description: string
   vehicle: string
   review: any,
   value: number,
   userId: string,
   origin: string,
   destination: string,
   distance: number,
   duration: string,
}

export default function DriverCard({ id, name, description, vehicle, review, value, userId, origin, destination, distance, duration }: driver) {   
   const confirmDriver = async () => {
      try {
         const response = await fetch(`http://localhost:8080/ride/confirm`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               customer_id: userId,
               origin,
               destination,
               distance,
               duration,
               driver: { id, name },
               value
            }),
         });

         const data = await response.json();

         if (response.status !== 200) {
            toast.error(data.error_description)
         }

         if (response.status === 200) {
            toast.success("Viagem confirmada")
         }
      } catch (err: any) {
         toast.error(err.message)
      }
   };

   return (
      <div className="DCMain">
         <Desc name="Nome:" data={name}/>
         <Desc name="Descrição:" data={description}/>
         <Desc name="Veículo:" data={vehicle}/>
         <Desc name="Avaliação:" data={`${review.rating}/5`}/>
         <Desc name="Valor da viagem:" data={`R$ ${value.toFixed(2)}`}/>
         <button className='DCButton' onClick={confirmDriver}>Escolher</button>
      </div>
   )
}