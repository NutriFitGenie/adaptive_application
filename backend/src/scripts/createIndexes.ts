import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/UserModel';
import Recipe from '../models/recipe';

async function createIndexes() {
  try {
    // Verify environment variable
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nutrition-app';
    
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    // Create indexes
    console.log('Creating indexes...');
    await User.collection.createIndex({ "preferences.allergies": 1 });
    await Recipe.collection.createIndex({ mealType: 1 });
    await Recipe.collection.createIndex({ dietaryTags: 1 });
    await Recipe.collection.createIndex({ ingredients: "text" }, { 
      weights: { ingredients: 1 },
      name: "ingredients_text" 
    });

    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the script
createIndexes();