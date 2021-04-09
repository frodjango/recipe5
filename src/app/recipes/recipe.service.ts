import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  public recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    constructor(
      private store: Store<fromApp.AppState>
    ) {}

    // Getter that returns a COPY !!!!
    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
      return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
      console.log("From RecipeService number of recipe: " + this.recipes.length);
    }

    updateRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }

    getLastIndex() {
      return this.recipes.length - 1;
    }

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.recipesChanged.next(this.recipes.slice());
    }

}
