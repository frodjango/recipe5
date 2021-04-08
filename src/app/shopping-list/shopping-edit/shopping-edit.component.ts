import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode: Boolean = false;
  // editedItemIndex: number;
  // editedIngredient: Ingredient;

  constructor(
    // private slService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        // this.editedIngredient = stateData.editedIngredient;
        this.slForm.setValue({
          'name': stateData.editedIngredient.name,
          'amount': stateData.editedIngredient.amount
        });
      }
      else {
        this.editMode = false;
      }
    })
  }

  cleanEditMode() {
    this.editMode = false;
    this.slForm.reset()
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient ));
    this.cleanEditMode();
  }

  onUpdateItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.store.dispatch(
      new ShoppingListActions.UpdateIngredient(newIngredient)
    );
    this.cleanEditMode();
  }

  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient()
    );
    this.cleanEditMode();
  }

  onClear() {
    this.cleanEditMode();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
     // in case we exit of the edit page...
     this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
