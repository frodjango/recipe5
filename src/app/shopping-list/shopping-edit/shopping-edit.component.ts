import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode: Boolean = false;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      // I'm subscribing to any changes in the shopping-list store BUT i'm only
      // worried by a value of editedIngredientIndex > -1
      // This I DO care and will act upon right here !
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
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
