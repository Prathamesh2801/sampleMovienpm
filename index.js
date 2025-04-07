import express from "express";
import { getMovieInfo } from "./movieDetails.js";
const app = express();

let reviews = [];
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use((req, res, next) => {
  const date = new Date();
  res.locals.currentHour = date.getHours();
  res.locals.year = date.getFullYear();
  next();
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/reviews", async (req, res) => {
  res.render("reviews", { res: reviews });
});

app.post("/reviews", async (req, res) => {
  const userMN = req.body["userMN"];
  const userMD = req.body["userMD"];

  const newReview = {
    id: new Date().getTime().toString(),
    MovieName: userMN,
    MovieDesc: userMD,
  };
  console.log(newReview);
  reviews.push(newReview);

  res.redirect("/reviews");
});

app.get("/reviews/:id/edit", (req, res) => {
  const reviewId = req.params.id;
  console.log(reviewId);
  const reviewData = reviews.find((r) => r.id === reviewId);
  res.render("reviewEdit", { review: reviewData });
});

app.post("/reviews/:id/edit", (req, res) => {
  const reviewId = req.params.id;
  console.log(reviewId);
  const { userMN, userMD } = req.body;
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
  if (reviewIndex === -1) {
    res.status(404).send("Review Not Found");
  }
  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    MovieName: userMN,
    MovieDesc: userMD,
  };
  res.redirect("/reviews");
});

app.post("/reviews/:id/delete", (req, res) => {
  const reviewId = req.params.id;
  console.log(reviewId);
  reviews = reviews.filter((r) => r.id !== reviewId);
  res.redirect("/reviews");
});

app.post("/searchReview", async (req, res) => {
  const userSearch = req.body["searchReview"].trim().toLowerCase();
  console.log(userSearch);
  let filterByName = reviews;
  if (userSearch) {
    filterByName = reviews.filter((review) =>
      review.MovieName.trim().toLowerCase().includes(userSearch)
    );
    // console.log(filterByName);
    res.render("reviews", { res: filterByName });
  }
});
app.post("/search", async (req, res) => {
  const movieName = req.body["mn"];
  try {
    if (movieName.trim()) {
      const { name, plot, posterImage } = await getMovieInfo(movieName);
      res.render("movieHero", {
        movieName: name,
        movieDesc: plot,
        moviePoster: posterImage.url,
      });
    } else {
      res.status(500).redirect("/");
    }
  } catch (error) {
    res.status(404).send("Movie Not Found");
  }
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server Listening on Port: ${PORT}`);
});
