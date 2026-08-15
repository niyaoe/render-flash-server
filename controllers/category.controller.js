const Category = require("../models/Category");

// ================================
// GET ALL CATEGORIES
// ================================

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.json(categories);
  } catch (err) {
    console.log("Get categories error:", err);

    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

// ================================
// GET SINGLE CATEGORY
// ================================

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    console.log("Get category error:", err);

    res.status(500).json({
      message: "Failed to fetch category",
    });
  }
};

// ================================
// CREATE CATEGORY
// ================================

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
      image: image || "",
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    console.log("Create category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================================
// UPDATE CATEGORY
// ================================

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name) {
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    console.log("Update category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ================================
// DELETE CATEGORY
// ================================

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.log("Delete category error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};