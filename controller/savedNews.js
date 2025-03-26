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
    const userId = req.user._id;
    const { source, title, date, description, image } = req.body;
    const articleId = req.params.id;
    if(!userId) {
        return next(new UnauthorizedError("please login!"))
    }
    const newArticle = {
        id: articleId, 
        userId, 
        source,
        title,
        date,
        description,
        image,
      };
    
      savedArticles.push(newArticle);
      return res.status(201).send(newArticle);
    };
    
    
    const deleteArticle = (req, res, next) => {
      const articleId = req.params.id; 
      const userId = req.user._id;
    
      if (!userId) {
        return next(new UnauthorizedError("please login!"));
      }
    
      const articleIndex = savedArticles.findIndex((article) => article.id === id && article.userId === userId);
    
      if (articleIndex === -1) {
        return next(new NotFoundError("News article not found."));
      }
    
      savedArticles.splice(articleIndex, 1); 
      return res.status(200).json({ message: "news is deleted" });
    };
    
    module.exports = { savedArticle, getSavedArticles, deleteArticle };
    


