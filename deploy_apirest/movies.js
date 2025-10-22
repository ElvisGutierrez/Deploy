const express = require("express");
const movie = require("./movies.json");
const crypto = require("node:crypto");

const app = express();

app.use(express.json());

app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const mov = movie.find((mov) => mov.id === id);
  if (mov) return res.json(mov);
  res.status(404).json({ message: "Movie not found" });
});

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filterMovies = movie.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filterMovies);
  }
  res.json(movie);
});

//Agregar
app.post("/movies", (req, res) => {
  const newMovie = {
    id: crypto.randomUUID(),
    ...req.body,
  };
  movie.push(newMovie);
  res.status(201).json(newMovie);
});

//Eliminar
app.delete("/movies/:id", (req, res) => {
  const id = req.params.id;
  const movieIndes = movie.findIndex((m) => m.id === id);

  if (movieIndes === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movie.splice(movieIndes, 1);

  return res.json({ message: "movie delete" });
});

//Actualizar
app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movie.findIndex((m) => m.id === id);

  movie[movieIndex] = { ...movie[movieIndex], ...req.body };

  res.json(movie[movieIndex]);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
