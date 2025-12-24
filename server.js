
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));


app.get("/api/user", async (req, res) => {
  try {
    
    const userResponse = await axios.get("https://randomuser.me/api/");
    const user = userResponse.data.results[0];

    const userData = {
      firstName: user.name.first,
      lastName: user.name.last,
      gender: user.gender,
      age: user.dob.age,
      dob: user.dob.date,
      picture: user.picture.large,
      city: user.location.city,
      country: user.location.country,
      address: `${user.location.street.number} ${user.location.street.name}`
    };

    
    const countryResponse = await axios.get(
      `https://restcountries.com/v3.1/name/${userData.country}?fullText=true`
    );

    const country = countryResponse.data[0];

    const currencyCode = Object.keys(country.currencies)[0];

    const countryData = {
      name: country.name.common,
      capital: country.capital,
      languages: country.languages,
      currency: currencyCode,
      flag: country.flags.png
    };

    
    let exchangeRates = {};

    if (currencyCode) {
      const exchangeURL = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${currencyCode}`
      );

      exchangeRates = {
        USD: exchangeURL.data.conversion_rates.USD,
        KZT: exchangeURL.data.conversion_rates.KZT
      };
    }

    
    const newsURL = await axios.get(
      `https://newsapi.org/v2/everything?q=${userData.country}&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`
    );

    const news = newsURL.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      url: article.url
    }));

    
    res.json({
      user: userData,
      country: countryData,
      exchangeRates,
      news
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
