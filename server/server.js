//Here we will write our server code

//Loading the environment variable from dotenv file.

require("dotenv").config(); // This will keep our API and other sensitive information safe.

const express = require("express"); // Express is a nodejs framework that provide a robust set of features for web application.

const axios = require("axios") // axios is a promise based HTTP client for browsing in nodejs which will use to make request to our external API.

const cors = require("cors"); // Cors is a middleware that allow us to enable the cors origin resource sharing which is necessary because 

//const { Message } = require("@mui/icons-material");

//we will be making request to our server to our from a different domain for example our frontend which will be in react.

// Creating an instant of express application by calling the express function.
const app = express(); // app object will use to setup the route and middleware.

app.use(cors()); // enabling the cors for all routes in our application that allows our frontend which might be running on different origin to make request to our backend.

app.use(express.urlencoded({ extended: true })); // It is used to pass the incoming request with URL encoded playload. True allow us to pass nested object whic will be used for more complex data structure.

//Now,storing the API keys by accessing these api keys from environment variable using process.env.
// This key will be used to authenticate our request to the news APIs ensuring that we have permission to access the data.
const API_KEY = process.env.API_KEY;

// Creating a function to fetch news.It will make request by provided URL using axios.

function fetchNews(url, res) {
    axios.get(url)
        .then(response => { // If there are results then it response with a json object
            if (response.data.totalResults > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Successfully fetched the data",
                    data: response.data
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "No more results to show",

                });
            }
        })
        .catch(error => { // here we are handeling the error during the request
            res.json({
                status: 500,
                success: false,
                message: "Failed to fetch the data from API",
                error: error.message
            })

        })
}

// Now we will define a route to get all this 
app.get("/all-news",(req,res)=>{
    let pageSize = parseInt(req.query.pageSize) || 40;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url,res)

});

// top head lines

app.options('/top-headlines',cors()); // It handle pre flight request
app.get('/top-headlines',(req,res)=>{
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "business";
    let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`
    fetchNews(url,res);

});

//Country specific news.
// ISO is url parameter representin the country code
app.options("/country/:iso", cors());

app.get("/country/:iso", (req, res)=>{
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    const country = req.params.iso;
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`;
    fetchNews(url,res);
 })

 
//port

const PORT = process.env.PORT || 5500;

app.listen(PORT,()=>{
    console.log(`server is running on the ${PORT}`)
});