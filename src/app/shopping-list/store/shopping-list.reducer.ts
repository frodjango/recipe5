import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

export interface AppState {
  shoppingList: State
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1,
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
    case ShoppingListActions.UPDATE_INGREDIENT: {
      // Step 1
      const ingredient: Ingredient = state.ingredients[state.editedIngredientIndex];
      // We copy the original ingredient into a new one then overlay the updates
      const updatedIngredient = {...ingredient, ...action.payload};
      // Step 2
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      }
    }
    case ShoppingListActions.DELETE_INGREDIENT: {
      // BOTH methods work !

      // const updatedIngredients: Ingredient[] = [...state.ingredients];
      // updatedIngredients.splice(action.payload,1);
      // return {...state, ingredients: updatedIngredients}
      // }

      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        })
      }
    }
    case ShoppingListActions.START_EDIT: {
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
        }
    }
    case ShoppingListActions.STOP_EDIT: {
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    }

    default: {
      return state;
    }
  }
}

