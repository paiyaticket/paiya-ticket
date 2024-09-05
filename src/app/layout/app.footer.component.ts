import {Component} from '@angular/core';
import {LayoutService} from "./service/app.layout.service";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    standalone: true,
    imports: [
        CommonModule,
    ]
})
export class AppFooterComponent {

    constructor(public layoutService: LayoutService) {}

    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }
}
