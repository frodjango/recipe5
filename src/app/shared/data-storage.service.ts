import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

import { Subject, throwError } from "rxjs";
import { catchError, map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  private firebase: string = "https://ng-course-recipe-book-24337-default-rtdb.firebaseio.com/";
  error = new Subject<string>();

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) {}

  storeRecipes() {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    return this.http
    .put<{name: string}>(
      this.firebase + 'recipes.json',
      recipes)
    .subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  // Challenge here - return two observables

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.firebase + 'recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(
            recipe => {
              return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}
