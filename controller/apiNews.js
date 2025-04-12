const fetch = require("node-fetch");  
const API_KEY = process.env.NEWS_API_KEY;  

exports.getNews = async (req, res) => {
  const { q } = req.query;  
  try {
    
    const response = await fetch(`https://newsapi.org/v2/everything?q=${q}&apiKey=${API_KEY}`);
    const data = await response.json();

    if (data.status === "ok") {
      res.json(data); 
    } else {
      res.status(400).json({ message: "Error fetching news" });
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" }); 
  }
};
