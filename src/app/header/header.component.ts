import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }

  dataStorageSub: Subscription;
  userSub: Subscription;
  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe( user => {
        // this.isAuthenticated = user ? true : false;  // standard way
        this.isAuthenticated = !!user;                  // cool new way
      });

  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageSub = this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.dataStorageSub.unsubscribe();
    this.userSub.unsubscribe();
  }


}
