const fs = require("fs");
const path = require("path");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");

const ARTICLES_FILE = path.join(__dirname, "..", "data", "savedArticles.json");

function readArticlesFromFile() {
  if (!fs.existsSync(ARTICLES_FILE)) {
    console.log("no file");
    return [];
  }
  try {
    const fileData = fs.readFileSync(ARTICLES_FILE, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    console.error("error:", err);
    return [];
  }
}

function writeArticlesToFile(articles) {
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
}

const getSavedArticles = (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return next(new UnauthorizedError("please login!"));
  }
  const savedArticles = readArticlesFromFile();
  const userArticles = savedArticles.filter(
    (article) => article.userId === userId
  );

  return res.status(200).json(userArticles);
};

const savedArticle = (req, res, next) => {
  const userId = req.user._id;
  const { id, source, title, date, description, image, keywords } = req.body;

  console.log(req.body);

  if (!userId) {
    return next(new UnauthorizedError("please login!"));
  }
  if (!id) {
    return next(new BadRequestError("Article ID is required"));
  }

  const savedArticles = readArticlesFromFile();

  const newArticle = {
    id,
    userId,
    source: source?.name,
    title,
    date,
    description,
    image,
    keywords,
  };

  savedArticles.push(newArticle);
  writeArticlesToFile(savedArticles);

  return res.status(200).json({ message: "Article saved successfully" });
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    return next(new UnauthorizedError("please login!"));
  }
  const savedArticles = readArticlesFromFile();

  const articleIndex = savedArticles.findIndex(
    (article) => article.id === articleId && article.userId === userId
  );

  if (articleIndex === -1) {
    return next(new NotFoundError("News article not found."));
  }

  savedArticles.splice(articleIndex, 1);
  writeArticlesToFile(savedArticles);
  return res.status(200).json({ message: "news is deleted" });
};

module.exports = {
  savedArticle,
  getSavedArticles,
  deleteArticle,
  readArticlesFromFile,
  writeArticlesToFile,
};
