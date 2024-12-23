import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        GalleriaModule,
        ButtonModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    images: any[] | undefined;
    responsiveOptions: any[] = [
        {
            breakpoint: '1920px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1024px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    ngOnInit() {
        this.images = [
            {
                itemImageSrc: 'https://firebasestorage.googleapis.com/v0/b/paiya-413605.appspot.com/o/web-contents%2Fimages%2Fpaiyaticket_landing_image1.png?alt=media&token=1ff878c2-8d26-4bae-a097-20b86443d831',
                thumbnailImageSrc: 'https://firebasestorage.googleapis.com/v0/b/paiya-413605.appspot.com/o/web-contents%2Fimages%2Fpaiyaticket_landing_image1.png?alt=media&token=1ff878c2-8d26-4bae-a097-20b86443d831',
                alt: 'Bienvenu sur paiyaticket',
                title: 'La ou vos evènements prennent vie.'
            },
            {
                itemImageSrc: 'https://firebasestorage.googleapis.com/v0/b/paiya-413605.appspot.com/o/web-contents%2Fimages%2Fpaiyaticket_landing_image2.png?alt=media&token=a1b9e473-0012-4856-8814-b22f6801d57b',
                thumbnailImageSrc: 'https://firebasestorage.googleapis.com/v0/b/paiya-413605.appspot.com/o/web-contents%2Fimages%2Fpaiyaticket_landing_image2.png?alt=media&token=a1b9e473-0012-4856-8814-b22f6801d57b',
                alt: 'Organisateur d\'évènement, nous vendons vos billets',
                title: 'Organisateur d\'évènement, nous vendons vos billets'
            },

        ]
    }

}
