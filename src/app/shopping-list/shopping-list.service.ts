import { Injectable } from "@angular/core";
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
    // public ingredientChanged = new Subject<Ingredient[]>();
    // public startedEditing = new Subject<number>();

    // private ingredients: Ingredient[] = [
    //     new Ingredient('Apples', 5),
    //     new Ingredient('Tomatoes', 10)
    //   ];

    // Getter that returns a COPY !!!!
    // getIngredients() {
    //     return this.ingredients.slice();
    // }

    // getIngredient(index: number) {
    //     return this.ingredients[index];
    // }

    // addIngredient(ingredient: Ingredient) {
    //     this.ingredients.push(ingredient);
    //     this.ingredientChanged.next(this.ingredients.slice());
    // }

    // addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //     // version 1
    //     // for (var ingredient of ingredients) {
    //     //     this.addIngredient(ingredient);
    //     // }
    //     // version 2 - plus fancy !
    //     this.ingredients.push(...ingredients);
    //     this.ingredientChanged.next(this.ingredients.slice());
    // }

    // updateIngredient(index: number, newIngredient: Ingredient) {
    //     this.ingredients[index] = newIngredient;
    //     this.ingredientChanged.next(this.ingredients.slice());
    // }

    // removeIngredient(index: number) {
    //     this.ingredients.splice(index, 1);
    //     this.ingredientChanged.next(this.ingredients.slice());
    // }
}
