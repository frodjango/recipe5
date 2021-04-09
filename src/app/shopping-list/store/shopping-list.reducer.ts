import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}


const initialState: State = {
  // The core of data is the ingredient list

  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],

  // There's a mode (-1 vs 0, 1, 2, ...) in this app associated with shopping-list editing.

  editedIngredient: null,    // direct access to ingredient being edited (workspace ?)
  editedIngredientIndex: -1,
}

// .select used in
//    shopping-list.component.ts / ngOnInit (no subscribe)
//    shopplig-edit.component.ts / ngOnInit (WITH subscribe)

// What does it mean to subscribe to the store ?
//
// The remote component wants to be told when something in the store changes.
// The component will then question the store about certain criterias and condition
// it will then react accordingly.


// .dispatch used in many more occasions.
//    shopping-list.component.ts /
//        .StartEdit
//    shopplig-edit.component.ts /
//        .AddIngredient
//        .UpdateIngredient
//        .DeleteIngredient
//        .StopEdit
//    recipe.service.ts /
//        .AddIngredients(ingredients)



export function shoppingListReducer(
  state = initialState,   // if state is null then use default value - lazy instanciation
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT: {
        return {
          ...state,
          // This corresponds to one push but fancier
          // Take note - only the ingredients field is affected
          ingredients: [...state.ingredients, action.payload]
        }
    }
    case ShoppingListActions.ADD_INGREDIENTS: {
      return {
        ...state,
        // This corresponds to many pushes but fancier
        // Take note - only the ingredients field is affected
        ingredients: [...state.ingredients, ...action.payload]
      }
    }
    case ShoppingListActions.UPDATE_INGREDIENT: {
      // Step 1 - patch the implicit store ingredient
      // An existing ingredient will be patched with new fields (not all fields)
      // Copy the whole existing ingredient into a fresh new one
      const ingredient: Ingredient = state.ingredients[state.editedIngredientIndex];
      // We copy the original ingredient into a new one then overlay the updates
      // Fancy - isn't it ?
      const updatedIngredient = {...ingredient, ...action.payload};

      // Step 2 - patch the ingredients variable
      // Next we need to "patch" the store variable in which this is going.
      // Since this is an array we need to "patch in" this new entry
      //
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        // Take note - only the ingredients field is affected
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
        // Take note - only the ingredients field is affected
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        })
      }
    }
    case ShoppingListActions.START_EDIT: {
      return {
        ...state,
        // Only those two fields a re affected
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
        }
    }
    case ShoppingListActions.STOP_EDIT: {
      return {
        ...state,
        // Only those two fields a re affected
        editedIngredientIndex: -1,
        editedIngredient: null
      }
    }

    default: {
      return state;
    }
  }
}

