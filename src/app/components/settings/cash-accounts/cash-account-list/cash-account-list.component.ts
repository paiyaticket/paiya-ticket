import { ChangeDetectionStrategy, Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Auth, getAuth } from '@angular/fire/auth';
import { MessageService, Message, ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { CashAccount } from '../../../../models/cash-account';
import { CashAccountService } from '../../../../services/cash-account.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CashAccountComponent } from '../cash-account/cash-account.component';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-cash-account-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        TableModule,
        CashAccountComponent,
        ConfirmDialogModule
    ],
    templateUrl: './cash-account-list.component.html',
    styleUrl: './cash-account-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashAccountListComponent implements OnInit, OnChanges{
    
    
    cashAccounts : CashAccount[] = [];
    cashAccounts$ : Observable<CashAccount[]> | undefined;


    private cashAccountService : CashAccountService = inject(CashAccountService);
    private router : Router = inject(Router);
    private messageService : MessageService = inject(MessageService);
    message : Message | undefined;
    
    ngOnInit(): void {
        const auth : Auth = getAuth();
        const currentUser = auth.currentUser;
        if(currentUser?.email){
            const email = currentUser.email;
            this.cashAccounts$ = this.cashAccountService.listByUserEmail(email);
        }
    } 

    ngOnChanges(changes: SimpleChanges): void {
        
    }

}
