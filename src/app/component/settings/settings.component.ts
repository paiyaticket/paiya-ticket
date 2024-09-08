import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        SettingsSidebarComponent,
        DividerModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

}
