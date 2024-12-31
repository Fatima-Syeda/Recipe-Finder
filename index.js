import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

env.config();

const app = express();
const port = 3000;
const API_URL = "https://api.spoonacular.com/recipes/complexSearch?";
const ApiKey = process.env.API_KEY


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.render("index.ejs")
    
  });

  function resetForm(form) {
    form.querySelectorAll('input').forEach(input => input.value = '');
  }

app.post("/submit", async (req, res) => {
  console.log(req.body);

  try {
    //console.log(req.body);
    const cuisine = req.body.cuisine || "";
    const diet = req.body.diet || "";
    const type = req.body.type || "";
    //console.log(cuisine);
    //console.log(diet);
    //console.log(type);

    const response = await axios.get(
      `${API_URL}apiKey=${ApiKey}&cuisine=${cuisine}&diet=${diet}&type=${type}`
    );

    const result = response.data;

    //console.log(result);

    const links = []; 

    for (let i = 0; i < result.results.length; i++) {
      try {
        const info = await axios.get(
          `https://api.spoonacular.com/recipes/${result.results[i].id}/information?apiKey=${ApiKey}&includeNutrition=false`
        );

        links.push(info.data.sourceUrl); 
      } catch (error) {
        console.error(`Failed to fetch data for recipe ID: ${result.results[i].id}`, error.message);
      }
    }

    //console.log(links); 

    res.render("results.ejs", {recipies: result.results, url: links, cuisine: cuisine, diet: diet, type: type });
  
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: "No results match your search.",
    });
  }
  });


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  
