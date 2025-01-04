import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-most-popular-event',
  standalone: true,
  imports: [],
  templateUrl: './most-popular-event.component.html',
  styleUrl: './most-popular-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostPopularEventComponent {

}
