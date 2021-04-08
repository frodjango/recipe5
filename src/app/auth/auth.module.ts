import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule} from "@angular/forms";

import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule, FormsModule, SharedModule, RouterModule.forChild([
      {path: '', component: AuthComponent}
    ])],
  exports: [RouterModule]
})
export class AuthModule {}
