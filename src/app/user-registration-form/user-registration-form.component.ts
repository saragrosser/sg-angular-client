import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'], // corrected property name and used an array
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = {
    UserName: '',
    Password: '',
    Email: '',
    Birthdate: '', // Initialize as a string
  };
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        // Logic for a successful user registration goes here!
        this.dialogRef.close(); // This will close the modal on success!
        this.snackBar.open('User registered successfully!', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        // Display error message in the snackbar
        this.snackBar.open(`Error: ${error.error.message}`, 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
