import { Action } from "@ngrx/store";

import { Ingredient } from "../../shared/ingredient.model";

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

// NOTE
//
// use     .select('shoppingList       to identify all "customers" of this actions set

// The intance variable payload is passed from the "customer" source code and is then passed
// as the patch parameter to the reducer (it will know what to do with it).

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

// arg = none since the call will come from the edit component we can use the reducer's
// "localy" stored 'editedIngredientIndex' to complete the task - no explicit arg required

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
  constructor() {}
}

// arg = which index in the ingredient array to edit

export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload: number) {}
}

// arg = none since we're eseting the store variable(s) to default value(s)

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
  constructor() {}
}

export type ShoppingListActions =
  AddIngredient |
  AddIngredients |
  UpdateIngredient |
  DeleteIngredient |
  StartEdit |
  StopEdit;
