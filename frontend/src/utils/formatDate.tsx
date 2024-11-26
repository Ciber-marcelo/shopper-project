export function formatDate(dateString: string) {
   const date = new Date(dateString);

   // Converte para horário brasileiro
   const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Sao_Paulo",
   };

   return new Intl.DateTimeFormat("pt-BR", options).format(date);
}
