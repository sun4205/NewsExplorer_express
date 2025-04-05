const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ConflictError = require("../utils/errors/ConflictError");

const savedkeywords = [];

const getsavedQuery = (req,res,next) => {
    const userId = req.user._id;
    SavedKeywords.find({ userId })
    .then((keywords) => res.json(keywords))
    .catch((err) => res.status(500).json({ error: "Failed to get keywords" }));
}

const savedQuery = (req,res,next) => {
    const userId = req.user._id;
    const { keywords } = req.body;

 
  SavedKeywords.updateOne({ userId }, { keywords }, { upsert: true })
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json({ error: "Failed to save keywords" }));

}

module.exports = {getsavedQuery,savedQuery };
    