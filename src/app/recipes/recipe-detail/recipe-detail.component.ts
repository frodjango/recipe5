import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../../recipes/recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = null;
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  // ngOnInit() {
  //   this.route.params
  //     .subscribe(
  //     (params: Params) => {
  //       if (+params['id'] > this.recipeService.getLastIndex()) {
  //         console.log("impossible to load that page " + params['id']);
  //       }
  //       else {
  //         this.id = +params['id'];
  //         this.recipe = this.recipeService.getRecipe(this.id);
  //         console.log("Id: " + this.id);
  //       }
  //     }
  //   )
  // }

  ngOnInit() {
    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
        console.log("Id: " + this.id);
      }
    )
  }



  onAddToShoppingList() {
    // Version perso ou ce component accedait directement au shopping-list service
    // this.slService.addRecipeToShoppingList(this.recipe.ingredients);
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onSelect() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
