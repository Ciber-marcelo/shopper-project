import React, { useState } from "react";
import './styles.css';
import { toast } from "react-toastify";
import Desc from "../Desc/Desc";
import { formatDate } from "../../utils/formatDate";

export default function RidesHistoryForm() {
   const [userId, setUserId] = useState("");
   const [driverId, setDriverId] = useState("all");
   const [rides, setRides] = useState<any>(null);

   const isOnlyNumbers = (str: string) => /^[0-9]+$/.test(str);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setRides(null);

      if (!isOnlyNumbers(userId)) {
         toast.error("O ID do usuário deve conter apenas números.");
         return;
      }

      try {
         const url = `http://localhost:8080/ride/${userId}${driverId !== "all" ? `?driver_id=${driverId}` : ""}`;
         const response = await fetch(url);

         if (response.status !== 200) {
            const errorData = await response.json();
            toast.error(errorData.error_description || "Erro ao buscar viagens.");
            return;
         }

         const data = await response.json();
         setRides(data.rides);
      } catch (err: any) {
         toast.error("Erro ao buscar viagens. Tente novamente.");
      }
   };

   return (
      <div className="RHMain">
         <div className="RHTitle">Histórico de Viagens</div>
         <form className="RHForm" onSubmit={handleSubmit}>
            <input
               className="RHInput"
               type="text"
               placeholder="ID do Usuário"
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               required
            />
            <select
               className="RHInput"
               value={driverId}
               onChange={(e) => setDriverId(e.target.value)}
            >
               <option value="all">Mostrar Todos</option>
               <option value="1">Homer Simpson</option>
               <option value="2">Dominic Toretto</option>
               <option value="3">James Bond</option>
            </select>
            <button className="RHButton" type="submit">BUSCAR VIAGENS</button>
         </form>

         <div className="RHTitle">Viagens realizadas</div>

         <div className="RHRides">
            {rides && (
               rides.map((e: any) => (
                  <div key={e.id} className="RHCard">
                     <Desc name='Data e Hora:' data={formatDate(e.date)} />
                     <Desc name='Motorista:' data={e.driver.name} />
                     <Desc name='Origem:' data={e.origin} />
                     <Desc name='Destino:' data={e.destination} />
                     <Desc name='Distância:' data={`${e.distance / 1000} km`} />
                     <Desc name='Tempo:' data={e.duration} />
                     <Desc name='Valor:' data={`R$ ${e.value.toFixed(2)}`} />
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
