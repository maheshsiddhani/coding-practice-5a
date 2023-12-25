const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get movies
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT 
      *
    FROM
    movie;`;
  const movies = await db.all(getMoviesQuery);
  response.send(
    movies.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

//Post Movie
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
    INSERT INTO movie(director_id,move_name,lead_actor)
    VALUES(
        ${directorId},
        '${movieName}',
        '${leadActor}';
        )`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//Get movie with id
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);

  const getMoviesQuery = `
    SELECT 
      *
    FROM
     movie
    WHERE
    movie_id = ${movieId};`;
  const movie = await db.get(getMoviesQuery);
  response.send(movie);
});
