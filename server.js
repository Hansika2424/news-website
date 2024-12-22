require("dotenv").config();

const express = require("express"); // minimal, flexible node js web application framework
const axios = require("axios"); // use to make HTTP requests from browser or node.js
const cors = require("cors"); // middleware

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const API_KEY = process.env.API_KEY; // this key will be used to authenticate our request to the API
const PORT = process.env.PORT || 3000; // Use PORT from the .env file or default to 3000

function fetchNews(url, res) {
    axios
        .get(url)
        .then((response) => {
            if (response.data.totalResults > 0) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Successfully fetched the data",
                    data: response.data,
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "No more results to show",
                });
            }
        })
        .catch((error) => {
            res.json({
                status: 500,
                success: false,
                message: "Failed to fetch data from the API",
                error: error.message,
            });
        });
}

// All news -> route to get all news
app.get("/all-news", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 40;
    let page = parseInt(req.query.page) || 1;
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;

    fetchNews(url, res);
});

// top headlines
app.options("/top-headlines", cors());
app.get("/top-headlines", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "politics";

    let url = `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// country specific
app.options("/country/:iso", cors());
app.get("/country/:iso", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 80;
    let page = parseInt(req.query.page) || 1;
    let country = req.params.iso;
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    fetchNews(url, res);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
