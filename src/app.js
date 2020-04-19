const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const repository = {
    ...repositories[index],
    title,
    url,
    techs,
  }

  repositories[index] = repository

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((r) => r.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const repository = repositories[index]
  repository.likes += 1

  return response.json(repository);
});

module.exports = app;
