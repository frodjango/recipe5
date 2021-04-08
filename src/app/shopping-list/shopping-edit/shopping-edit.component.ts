import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode: Boolean = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedIngredient = this.slService.getIngredient(index);
          this.slForm.setValue({
            'name': this.editedIngredient.name,
            'amount': this.editedIngredient.amount
          }
          )
        }
      );
  }

  cleanEditMode() {
    this.editMode = false;
    this.slForm.reset()
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    // this.slService.addIngredient(newIngredient);
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient ));
    this.cleanEditMode();
  }

  onUpdateItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    this.cleanEditMode();
  }

  onDelete() {
    console.log("Will remove this index: " + this.editedItemIndex);
    this.slService.removeIngredient(this.editedItemIndex);
    this.cleanEditMode();
  }

  onClear() {
    this.cleanEditMode();
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();
  }
}
