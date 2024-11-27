## Sobre

Uma aplicação para gerenciamento de corridas, que inclui estimativas de preços, confirmação de corridas e histórico de viagens. O projeto é composto por um backend RESTful e um frontend em React, ambos totalmente dockerizados para facilitar a implantação.

---

## Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**.
- **TypeScript** para tipagem estática.
- **Docker** para containerização.

### Frontend
- **React** com **TypeScript**.
- **React Toastify** para notificações.
- **CSS Modules** para estilização.

### Infraestrutura
- **Docker Compose** para orquestração dos serviços.
- Variáveis de ambiente para configuração.

---
## Instruções:

```bash
  # Crie um arquivo ".env" na raiz do projeto e adicione sua chave de API do Google Maps no seguinte formato:
  GOOGLE_API_KEY=<chave da API>

  # Compilar o projeto com docker:
  docker-compose up --build
```

---

## Funcionalidades

- **Estimativa de Corrida**: Calcule o valor e o tempo estimados para uma corrida com base nos dados fornecidos.
- **Confirmação de Corrida**: Confirme uma corrida e salve os detalhes no banco de dados.
- **Histórico de Corridas**: Consulte o histórico de corridas de um usuário, filtrando por motoristas se necessário.

---

<br/>
<div align="center">
  Desenvolvido por Marcelones
</div>


