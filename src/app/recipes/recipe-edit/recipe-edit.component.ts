import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe;
  id: number;
  editMode: boolean = false; 
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        console.log("Checking this id: " + this.id);
        this.id = Number.isNaN(this.id) ? null : this.id;
        this.editMode = (this.id == null) ? false : true;
        this.initForm();
      }
    )
  }

  // get controls() { // a getter!
  //   return (<FormArray>this.recipeForm.get('ingredients')).controls;
  // }

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  
  initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        console.log("Number ingredients: " + recipe.ingredients.length);
        for (let ingredient of recipe.ingredients) {
          console.log("Ingredient name: " + ingredient.name);
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }
    console.log("Done populating form: " + recipeIngredients.length);
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  private gatherRecipeElements() {
    // return new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // )
    //
    // It's the same
    return this.recipeForm.value;
  }

  onAdd() {
    this.recipeService.addRecipe(this.gatherRecipeElements());
    this.editMode = false; 
    this.recipeForm.reset();
    this.id = this.recipeService.getLastIndex();
    this.router.navigate(['../', this.id], {relativeTo: this.route});
  }

  onUpdate() {
    this.recipeService.updateRecipe(this.id, this.gatherRecipeElements());
    this.editMode = false; 
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]),
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.editMode = false; 
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
