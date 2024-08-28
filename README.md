# backend-hack-georgia

## Endpoints bala para o Franco começar bem o dia dele.

### 1. `GET /events`

**Descrição:** Retorna uma lista de todos os eventos cadastrados no banco de dados.

**Exemplo de Resposta:**

```json
[
  {
    "host": "example_host",
    "description": "Example description",
    "id": 123456,
    "accounts": []
  },
  ...
]
```

### 2. `POST /createEvent`

**Descrição:** Cria um novo evento no banco de dados. O ID do evento é gerado automaticamente como um número único de 6 dígitos.

**Corpo da Requisição:**

```json
{
  "host": "Nome do Host",
  "description": "Descrição do Evento"
}
```

**Exemplo de Resposta:**

```json
{
  "message": "Event created successfully",
  "event": {
    "host": "Nome do Host",
    "description": "Descrição do Evento",
    "id": 654321,
    "accounts": []
  }
}
```

### 3. `GET /event`

**Descrição:** Retorna os detalhes de um evento específico, com base no ID fornecido como parâmetro de consulta.

**Parâmetro de Consulta:**

- `id`: O ID do evento (número de 6 dígitos).

**Exemplo de Requisição:**

```bash
GET /event?id=123456
```

**Exemplo de Resposta:**

```json
{
  "host": "Nome do Host",
  "description": "Descrição do Evento",
  "id": 123456,
  "accounts": []
}
```

**Respostas de Erro:**

- `400 Bad Request`: Se o ID não for fornecido.
- `404 Not Found`: Se o evento com o ID especificado não for encontrado.

### 4. `POST /populateEvent`

**Descrição:** Popula o array `accounts` de um evento existente no banco de dados. Este endpoint é usado para adicionar contas ao evento especificado.

**Corpo da Requisição:**

```json
{
  "id": 123456,
  "accounts": ["account1", "account2", "account3"]
}
```

**Exemplo de Resposta:**

```json
{
  "message": "Event updated successfully",
  "event": {
    "host": "Nome do Host",
    "description": "Descrição do Evento",
    "id": 123456,
    "accounts": ["account1", "account2", "account3"]
  }
}
```

**Respostas de Erro:**

- `400 Bad Request`: Se o ID ou o array de `accounts` não forem fornecidos.
- `404 Not Found`: Se o evento com o ID especificado não for encontrado.
- `500 Internal Server Error`: Se ocorrer algum erro durante a atualização do evento.