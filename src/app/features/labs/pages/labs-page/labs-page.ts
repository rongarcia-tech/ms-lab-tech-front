import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LabsService } from '../../../../core/services/lab.service';
import { LabResponse } from '../../../../shared/models/labs.models';

@Component({
  selector: 'app-labs-page',
  standalone: false,
  templateUrl: './labs-page.html',
  styleUrl: './labs-page.scss',
})
export class LabsPage implements OnInit {
  labs$!: Observable<LabResponse[]>;

  constructor(
    private labsService: LabsService,
  ) {}

  ngOnInit(): void {
    this.labs$ = this.labsService.getAllLabs();
  }
}