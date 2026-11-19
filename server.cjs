// Import Express to create the web server and API routes
const express = require('express');
// Import Mongoose to connect to MongoDB and define schemas/models
const mongoose = require('mongoose');

// Initialize the Express application
const app = express();
// Middleware to parse incoming JSON request bodies (so req.body works on POST/PUT)
app.use(express.json());

// Connect to the MongoDB Atlas cluster using the 'admin' credentials and 'movies' database
mongoose.connect('mongodb+srv://admin:admin@cluster0.5vwnju8.mongodb.net/movies')
  .then(() => console.log('Connected to MongoDB')) // Log success when connected
  .catch((err) => console.error('MongoDB connection error:', err)); // Log any connection errors

// Define the structure (schema) and field data types for documents in the movies collection
const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  poster: String
});

// Create the 'Movie' model from the schema (maps to the 'movies' collection in MongoDB)
const Movie = mongoose.model('Movie', movieSchema);

// POST route to create and save a new movie document in MongoDB
app.post('/api/movies', async (req, res) => {
  // Extract title, year, and poster from the incoming request body
  const { title, year, poster } = req.body;

  // Create a new Movie instance and wait for it to save to the database
  const newMovie = new Movie({ title, year, poster });
  await newMovie.save();

  // Return HTTP 201 (Created) with a confirmation message and the saved movie
  res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
});

// GET route to fetch all movie documents from the collection
app.get('/api/movies', async (req, res) => {
  // Passing an empty filter {} returns every document in the movies collection
  const movies = await Movie.find({});
  // Send the array of movies back as JSON
  res.json(movies);
});

// GET route to fetch a single movie by its unique MongoDB _id from the URL parameter
app.get('/api/movie/:id', async (req, res) => {
  // Look up the document matching req.params.id
  const movie = await Movie.findById(req.params.id);
  // Send the found movie back in the response
  res.send(movie);
});

// Define the port and start listening for incoming HTTP requests
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});