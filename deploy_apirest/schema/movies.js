const z = require("zod");

const movieSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Pelicula debe ser un string",
      required_error: "Titulo de pelicula es requerido",
    })
    .min(1, { message: "El título no puede estar vacío" }),
  year: z.number().int().min(1900).max(2026),
  director: z.string(),
  duration: z.number().int().positive(),
  rating: z.number().min(0).max(10).default(5),
});

function validateMovie(input) {
  return movieSchema.safeParse(input);
}

function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}

module.exports = { validateMovie, validatePartialMovie };
