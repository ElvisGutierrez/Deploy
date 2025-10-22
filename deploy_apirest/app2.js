const express = require("express");
const app = express();
const api = require("./movies.json");
const crypto = require("node:crypto");
const { validateMovie, validatePartialMovie } = require("./schema/movies");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPT_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:5500"];

      if (ACCEPT_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by cors"));
    },
  })
);

//Mostrar peliculas
app.get("/peliculas", (req, res) => {
  res.json(api);
});

//Agregar peliculas
app.post("/peliculas", (req, res) => {
  const validations = validateMovie(req.body);

  if (!validations.success) {
    return res
      .status(400)
      .json({ error: JSON.parse(validations.error.message) });
  }

  const nuevaPelicula = {
    id: crypto.randomUUID(),
    ...validations.data,
  };

  api.push(nuevaPelicula);
  res.json(nuevaPelicula);
});

//Actualizar pelicula por id
app.patch("/peliculas/:id", (req, res) => {
  const validations = validatePartialMovie(req.body);
  const { id } = req.params;
  const peliculaIndex = api.findIndex((p) => p.id === id);

  api[peliculaIndex] = { ...api[peliculaIndex], ...validations.data };

  res.json(api[peliculaIndex]);
});

//Eliminar pelicula por id
app.delete("/peliculas/:id", (req, res) => {
  const { id } = req.params;
  const peliculaIndex = api.findIndex((p) => p.id === id);

  if (peliculaIndex === -1) {
    return res.status(404).json({ message: "Error" });
  }

  api.splice(peliculaIndex, 1);

  res.json({ message: "Pelicula ELiminada" });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/peliculas`);
});
