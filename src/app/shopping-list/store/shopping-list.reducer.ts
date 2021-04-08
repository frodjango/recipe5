import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ]
}

// if state is null then use default value
// Processing must be on immutable
// We could omit the state in the return since we're changing the whole store here
// but it's good practice to copy the whole state and specifiy wjat you want to change.

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT: {
        return {
          ...state,
          ingredients: [...state.ingredients, action.payload]
        }
    }
    case ShoppingListActions.ADD_INGREDIENTS: {
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      }
  }
    default: {
      return state;
    }
  }
}

