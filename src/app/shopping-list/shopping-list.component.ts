import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';

import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>; // Was once an observable - not required anymore.

  constructor(
    private loggingService: LoggingService, // to showcase a concept - not really useful
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // This component requires
    this.ingredients = this.store.select('shoppingList');
    // We could subscribe directly to the store in case we want to do other things
    // when the store changes, but there's no needs actually for this component.
    this.loggingService.printLog("Hello from ShoppingListComponent ngOnInit")
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
