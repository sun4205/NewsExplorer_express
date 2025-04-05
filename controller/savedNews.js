const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const savedArticles = [];

const getSavedArticles = (req, res, next) => {
    const userId = req.user._id;

    if(!userId) {
        return next(new UnauthorizedError("please login!"))
    }
    const userArticles = savedArticles.filter((article) => article.userId === userId);
    return res.status(200).json(userArticles);
};

const savedArticle = (req,res,next) => {
  console.log("Received data:", req.body);
    const userId = req.user._id;
    const { id, source, title, date, description, image,keywords, savedQuery   } = req.body; 

    console.log(req.body)
    console.log("savedQuery:", savedQuery); 

    if(!userId) {
        return next(new UnauthorizedError("please login!"))
    }
    if (!id) {
      return next(new BadRequestError("Article ID is required"));
    }
    const newArticle = {
        id, 
        userId, 
        source:source?.name, 
        title,
        date,
        description,
        image,
        keywords,
        savedQuery 
      };
      console.log("newArticle:", newArticle);
    
      savedArticles.push(newArticle);
      console.log("Saved Article:", savedArticles);
      return res.status(201).send(newArticle);
    };
    
    
    const deleteArticle = (req, res, next) => {
      const articleId = req.params.id; 
      const userId = req.user._id;
    
      if (!userId) {
        return next(new UnauthorizedError("please login!"));
      }

      console.log("Saved Articles:", savedArticles);
      console.log("Article ID:", articleId);
      console.log("User ID:", userId);
    
      const articleIndex = savedArticles.findIndex((article) => article.id === articleId  && article.userId === userId);
    
      if (articleIndex === -1) {
        console.log("Article not found:", articleId);
        return next(new NotFoundError("News article not found."));
      }

      console.log("Article found:", savedArticles[articleIndex]);
    
      savedArticles.splice(articleIndex, 1); 
      return res.status(200).json({ message: "news is deleted" });
    };
    
    module.exports = { savedArticle, getSavedArticles, deleteArticle };
    


