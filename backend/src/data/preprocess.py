import pandas as pd
import ast
import json
import math

def process_recipes():
    # Load raw data
    recipes = pd.read_csv('./RAW_recipes.csv', usecols=[
        'id', 'name', 'minutes', 'ingredients', 'steps', 'nutrition', 'tags'
    ])
    
    # Replace NaN values with None for all columns
    recipes = recipes.where(pd.notnull(recipes), None)

    # Parse stringified columns if they have a value; otherwise, provide defaults
    recipes['ingredients'] = recipes['ingredients'].apply(lambda x: ast.literal_eval(x) if x else [])
    recipes['steps'] = recipes['steps'].apply(lambda x: ast.literal_eval(x) if x else [])
    recipes['tags'] = recipes['tags'].apply(lambda x: ast.literal_eval(x) if x else [])
    recipes['nutrition'] = recipes['nutrition'].apply(
        lambda x: [None if math.isnan(float(v)) else float(v) for v in ast.literal_eval(x)] if x else []
    )

    # Structure output
    processed = []
    for _, row in recipes.iterrows():
        processed.append({
            "originalId": row['id'],  # Add original ID for reference
            "name": row['name'],
            "cookingTime": None if pd.isna(row['minutes']) else row['minutes'],
            "ingredients": row['ingredients'],
            "preparationSteps": row['steps'],
            "nutritionalInfo": {
                "calories": row['nutrition'][0] if row['nutrition'] and len(row['nutrition']) > 0 else None,
                "protein": row['nutrition'][3] if row['nutrition'] and len(row['nutrition']) > 3 else None,
                "carbs": row['nutrition'][4] if row['nutrition'] and len(row['nutrition']) > 4 else None,
                "fats": row['nutrition'][5] if row['nutrition'] and len(row['nutrition']) > 5 else None
            },
            "dietaryTags": row['tags'],
            "allergens": get_allergens(row['ingredients'])
        })
    
    # Save to JSON with strict settings (no NaN allowed)
    with open('clean_recipes.json', 'w') as f:
        json.dump(processed, f, allow_nan=False)
    print("Processed recipes saved to clean_recipes.json")
    
def get_allergens(ingredients):
    allergens = []
    common_allergens = ['milk', 'eggs', 'fish', 'shellfish', 
                        'tree nuts', 'peanuts', 'wheat', 'soy', 'meat']
    
    for ingredient in ingredients:
        lower_ing = ingredient.lower()
        for allergen in common_allergens:
            if allergen in lower_ing:
                allergens.append(allergen)
    return list(set(allergens))

if __name__ == "__main__":
    process_recipes()