const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  savedArticle,
  getSavedArticles,
  deleteArticle,
} = require("../controller/savedNews");

router.get("/", auth, getSavedArticles);

router.post("/", auth, savedArticle); 
    
router.delete("/:id", auth, deleteArticle);

module.exports = router;
