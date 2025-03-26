const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  savedArticle,
  getSavedArticles,
  deleteArticle,
} = require("../controller/savedNews");

router.get("/saveNews", auth, getSavedArticles);
router.post("/saveNews", auth, savedArticle);
router.put("/saveNews/:id", auth, (req, res, next) => {
  const articleId = decodeURIComponent(req.params.id);
  req.params.id = articleId;
  savedArticle(req, res, next);
});
router.delete("/saveNews/:id", auth, (req, res, next) => {
  const decodedId = decodeURIComponent(req.params.id);
  req.params.id = decodedId;
  deleteArticle(req, res, next);
});

module.exports = router;
