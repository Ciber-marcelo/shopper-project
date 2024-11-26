import React, { useState } from "react";
import './styles.css';
import DriverCard from "../DriverCard/DriverCard";
import { toast } from 'react-toastify';

export default function RideRequestForm() {
   const [userId, setUserId] = useState("");
   const [origin, setOrigin] = useState("");
   const [destination, setDestination] = useState("");
   const [estimate, setEstimate] = useState<any>(null)

   const isOnlyNumbers = (str: string) => /^[0-9]+$/.test(str);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setEstimate(null);

      if (!isOnlyNumbers(userId)) {
         toast.error("O ID do usuário deve conter apenas números.")
         return;
      }

      if (origin === destination) {
         toast.error("A origem e o destino não podem ser iguais.")
         return;
      }

      try {
         const response = await fetch(`http://localhost:8080/ride/estimate`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               customer_id: userId,
               origin,
               destination,
            }),
         });

         const data = await response.json();

         if (response.status !== 200) {
            toast.error(data.error_description)
            throw new Error(data.error_description || "Erro ao buscar viagens.");
         }

         if (response.status === 200) {
            setEstimate(data)
         }
      } catch (err: any) {
         toast.error(err.message)
      }
   };

   return (
      <div className="RRFMain">
         <div className="RRFTitle">Solicitação de Viagem</div>
         <form className="RRFForm" onSubmit={handleSubmit}>
            <input
               className="RRFInput"
               type="text"
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               required
               placeholder="ID do Usuário"
            />
            <input
               className="RRFInput"
               type="text"
               value={origin}
               onChange={(e) => setOrigin(e.target.value)}
               required
               placeholder="Endereço de Origem"
            />
            <input
               className="RRFInput"
               type="text"
               value={destination}
               onChange={(e) => setDestination(e.target.value)}
               required
               placeholder="Endereço de Destino"
            />
            <button className="RRFButton" type="submit">ESTIMAR VIAGEM</button>
         </form>

         <div className="RRFTitle">Opções de Viagem</div>

         <div className="RRFOptions">
            {estimate && (
               estimate.options.map((e: any) => (
                  <DriverCard
                     key={e.id}
                     id={e.id}
                     name={e.name}
                     description={e.description}
                     vehicle={e.vehicle}
                     review={e.review}
                     value={e.value}
                     userId={userId}
                     origin={origin}
                     destination={destination}
                     distance={estimate.distance}
                     duration={estimate.duration}
                  />
               ))
            )}
         </div>

      </div>
   );
}
