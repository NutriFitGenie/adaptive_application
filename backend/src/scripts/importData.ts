import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/recipe';
import fs from 'fs';

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    
    // Clear existing recipes
    await Recipe.deleteMany();

    // Load cleaned data
    const recipes = JSON.parse(fs.readFileSync('./../data/clean_recipes.json', 'utf-8'));

    // Batch insert
    const BATCH_SIZE = 500;
    for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
      const batch = recipes.slice(i, i + BATCH_SIZE);
      await Recipe.insertMany(batch, { ordered: false });
      console.log(`Imported ${i + batch.length}/${recipes.length}`);
    }

    console.log('Recipe import completed!');
    process.exit();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
};

importData();