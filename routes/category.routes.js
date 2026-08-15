const express = require("express");

const router = express.Router();

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

// GET ALL
router.get("/", getCategories);

// GET ONE
router.get("/:id", getCategory);

// CREATE
router.post("/", createCategory);

// UPDATE
router.put("/:id", updateCategory);

// DELETE
router.delete("/:id", deleteCategory);

module.exports = router;