const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const KEYWORDS_FILE = path.join(__dirname, "..", "data", "savedKeywords.json");

function readKeywordsFromFile() {
  if (!fs.existsSync(KEYWORDS_FILE)) {
    return [];
  }
  const fileData = fs.readFileSync(KEYWORDS_FILE, "utf-8");
  return JSON.parse(fileData);
}

function writeKeywordsToFile(keywords) {
  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(keywords, null, 2));
}

const getsavedQuery = (req, res, next) => {
  const userId = req.user._id;

  if (!userId) {
    return next(new UnauthorizedError("please login!"));
  }

  const savedKeywords = readKeywordsFromFile();
  const userKeywords = savedKeywords.find((item) => item.userId === userId);

  if (!userKeywords) {
    return res.status(404).json({ message: "No keywords found for user." });
  }

  return res.status(200).json(userKeywords);
};
const savedQuery = (req, res, next) => {
  const userId = req.user._id;
  const { keywords } = req.body;

  if (!userId) {
    return next(new UnauthorizedError("please login!"));
  }

  let savedKeywords = readKeywordsFromFile();

  const existingIndex = savedKeywords.findIndex(
    (item) => item.userId === userId
  );

  if (existingIndex !== -1) {
    savedKeywords[existingIndex].keywords = keywords;
  } else {
    savedKeywords.push({ userId, keywords });
  }

  writeKeywordsToFile(savedKeywords);
  return res.status(200).json({ success: true });
};

module.exports = { getsavedQuery, savedQuery,readKeywordsFromFile,writeKeywordsToFile };
