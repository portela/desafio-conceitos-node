const express = require('express');
const cors = require('cors');
const { uuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function getRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  request.index = repositoryIndex;
  request.repository = repositories[repositoryIndex];

  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', getRepository, (request, response) => {
  const { index } = request;
  const { url, title, techs } = request.body;

  const repository = {
    ...repositories[index],
    title,
    url,
    techs,
  };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', getRepository, (request, response) => {
  const { index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', getRepository, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
