import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './coming-soon.component.html'
})
export class ComingSoonComponent {
  movieService = inject(MovieService);
}
