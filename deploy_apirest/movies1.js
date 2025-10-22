//declarar variables e incluir librerias a usar

const express = require("express");
const server = express();
const api = require("./movies.json");
const crypto = require("node:crypto");

server.use(express.json()); //middleware

server.get("/peliculas", (req, res) => {
  const { genre } = req.query;
  const peliculasGenero = api.filter((p) =>
    p.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
  );

  if (genre) {
    return res.json(peliculasGenero);
  }
  res.json(api);
});

server.get("/peliculas/:id", (req, res) => {
  const id = Number(req.params.id);
  const peliculasIndex = api.find((p) => p.id === id);

  res.json(peliculasIndex);
});

server.post("/peliculas/agregar", (req, res) => {
  const nuevaPelicula = {
    id: crypto.randomUUID(),
    ...req.body,
  };

  api.push(nuevaPelicula);
  res.status(201).json(nuevaPelicula);
});

server.patch("/peliculas/:id", (req, res) => {
  const { id } = req.params;
  const peliculaIndex = api.findIndex((p) => p.id === id);

  api[peliculaIndex] = { ...api[peliculaIndex], ...req.body };
  res.json(api[peliculaIndex]);
});

server.delete("/peliculas/:id", (req, res) => {
  const { id } = req.params;
  const eliminarPelicula = api.findIndex((p) => (p.id = id));

  api.splice(eliminarPelicula, 1);
  res.json({ Message: "Eliminada" });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`http://localhost:/${PORT}`);
});
