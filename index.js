const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken');

const app = express();
const port = 3009; // Or any port you prefer
app.use(cors());

// MongoDB connection
const uri = 'mongodb+srv://sarathchandran:56NcBTxvZmz35XKr@cluster0.v2ezzhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, connectionParams)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });



// Define Model

const movieSchema = new mongoose.Schema({
    backdrop: String,
    cast: [String],
    classification: String,
    director: String,
    genres: [String],
    id: String,
    imdb_rating: Number,
    length: String,
    overview: String,
    poster: String,
    released_on: Date,
    slug: String,
    title: String
  });


const Movie = mongoose.model('theater', movieSchema);

app.get('/movies', authenticateToken, async (req, res) => {
    try {
      // Query the database to fetch all movies
      const movies = await Movie.find();
      res.json(movies);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'FSMovies2023', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
