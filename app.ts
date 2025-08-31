//Все эндпоинты защищены, перед использованием необходимо зарегистрироваться и залогиниться и использовать в хедере выданный токен!
import express from "express";
import mongoose from "mongoose";
import movie from "./routes/movies.js";
import list from "./routes/lists.js";
import authroutes from "./routes/authRoutes.js";
const app = express();
app.use(express.json()); 
mongoose
  .connect("mongodb://127.0.0.1:27017/movielist")
  .then(() => console.log(" connected"))
  .catch((err) => console.error("  error:", err));

app.use("/movies", movie);
app.use("/lists", list);
app.use("/auth", authroutes);

const port=process.env.PORT || 8080;

app.listen(port, () => console.log("http://localhost:8080"));
