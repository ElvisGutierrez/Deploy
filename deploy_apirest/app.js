const express = require("express");
const movies = require("./movies.json");
const app = express();

app.use(express.json());
app.disable("x-powered-by");

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: "Película no encontrada" });
  }

  res.json(movie);
});

app.get("/movies");

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/movies`);
});
