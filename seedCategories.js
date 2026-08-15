const mongoose = require("mongoose");
const Category = require("./models/Category");

require("dotenv").config();

const categories = [
  {
    name: "Video Editing",
    description: "Video editing and post-production",
  },
  {
    name: "Motion Graphics",
    description: "Motion graphics and animation",
  },
  {
    name: "VFX",
    description: "Visual effects and compositing",
  },
  {
    name: "Photography",
    description: "Photography and photo manipulation",
  },
  {
    name: "Color Grading",
    description: "Color correction and cinematic grading",
  },
  {
    name: "Gaming Edit",
    description: "Gaming clips and gaming edits",
  },
  {
    name: "Cinematic",
    description: "Cinematic edits and filmmaking",
  },
  {
    name: "Tutorial",
    description: "Editing and creative tutorials",
  },
  {
    name: "Anime Edit",
    description: "Anime edits and AMV content",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const category of categories) {
      await Category.updateOne(
        { name: category.name },
        {
          $setOnInsert: category,
        },
        {
          upsert: true,
        }
      );
    }

    console.log("Categories seeded successfully");

    await mongoose.disconnect();

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);

    process.exit(1);
  }
};

seedCategories();