import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../../shared/models/user.models';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit {
  user$!: Observable<UserResponse>;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.getCurrentUser();
  }
}
