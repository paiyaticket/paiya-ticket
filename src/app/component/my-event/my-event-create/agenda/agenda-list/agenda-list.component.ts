import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [],
  templateUrl: './agenda-list.component.html',
  styleUrl: './agenda-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaListComponent {

}
