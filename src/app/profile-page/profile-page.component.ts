import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { Router } from '@angular/router';
import {
  AllMoviesService,
  UserListService,
  AddFavoriteMovieService,
  RemoveFavoriteMovieService,
} from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  movies: any[] = [];
  users: any[] = [];
  favorites: any[] = [];
  UserName: string = '';

  ngOnInit(): void {
    this.getMovies();
    this.getUsers();
    const { UserName } = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    this.UserName = UserName;
  }

  constructor(
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    public fetchMovies: AllMoviesService,
    public fetchUsers: UserListService,
    public addFavorite: AddFavoriteMovieService,
    public removeFavorite: RemoveFavoriteMovieService,
    private router: Router
  ) {}

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie }, // Pass the movie object to the dialog
      width: '600px',
    });
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { directorName: movie.Director },
      width: '600px',
    });
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }
  getUsers(): void {
    const { UserName } = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    this.fetchUsers.getUserList().subscribe((resp: any) => {
      this.users = resp;
      const currentUser = this.users.filter(
        (user) => user.UserName === UserName
      );

      this.favorites = currentUser[0].FavoriteMovies;
    });
  }

  // filter through movies to check if a movie is in the favorite list
  isFavorite(movie: any): boolean {
    const favorite = this.favorites.filter((title) => title === movie.Title);
    return favorite.length ? true : false;
  }

  addTitleToFavorites(movie: any): void {
    this.addFavorite
      .addFavoriteMovie(this.UserName, movie.Title)
      .subscribe((resp: any) => {
        console.log(resp);
        this.snackBar.open('Movie added', 'Success', {
          duration: 2000,
        });
      });
  }

  removeTitleFromFavorites(movie: any): void {
    this.removeFavorite
      .removeMovieFromFavorites(this.UserName, movie.Title)
      .subscribe((resp: any) => {
        console.log(resp);
        this.snackBar.open('Movie removed', 'Success', {
          duration: 2000,
        });
      });
  }
}
