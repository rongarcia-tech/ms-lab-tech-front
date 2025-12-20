import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Pages
import { ResultsPage } from './pages/results-page/results-page';
import { ResultFormPage } from './pages/result-form-page/result-form-page';

// Angular Material (solo lo que usas en esos templates)
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ResultsPage,
    ResultFormPage,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    // Material
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class ResultsModule {}
