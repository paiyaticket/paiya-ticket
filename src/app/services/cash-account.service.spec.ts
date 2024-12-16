import { TestBed } from '@angular/core/testing';

import { CashAccountService } from './cash-account.service';
import { HttpClient } from '@angular/common/http';
import { CashAccount } from '@models/cash-account';
import { MobileMoneyAccount } from '@models/mobile-money-account';
import { FinancialAccountType } from '@enumerations/financial-account-type';
import { MobileMoneyProvider } from '@enumerations/mobile-money-provider';
import { Observable } from 'rxjs';
import { asyncData } from '@utils/async-observable-helpers';
import exp from 'constants';

describe('CashAccountService', () => {
    let service: CashAccountService;
    let httpClientSpy : jasmine.SpyObj<HttpClient>;
    const id = '454d7a6sda34354ad4s';

    beforeAll(()=>{
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "patch", "delete"]);
        TestBed.configureTestingModule({
            providers : [CashAccountService, {provide : HttpClient, useValue : httpClientSpy}]
        })
        service = TestBed.inject(CashAccountService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#save method should persist a new CashAccount (httpClient POST called once)', (done : DoneFn) => {
        const expectedCashAccount : MobileMoneyAccount = buildCashAccount();

        httpClientSpy.post.and.returnValue(asyncData(expectedCashAccount));

        service.save(expectedCashAccount).subscribe({
            next(value) {
                expect(value).toBe(expectedCashAccount);
                expect(httpClientSpy.post).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            },
        });

    });

    it('#listByUserEmail method returns a list of CashAccounts', (done : DoneFn) => {
        const expectedCashAccounts : MobileMoneyAccount[] = [buildCashAccount()];
        const userEmail = 'user@gmail.com';

        httpClientSpy.get.and.returnValue(asyncData(expectedCashAccounts));

        service.listByUserEmail(userEmail).subscribe({
            next(value) {
                expect(value).toBe(expectedCashAccounts);
                expect(httpClientSpy.get).toHaveBeenCalled();
                expect(httpClientSpy.get.calls.first().args[1]?.params).toEqual({
                    "owner" : userEmail
                });
                done();
            },
            error(err) {
                done.fail(err);
            },
        });
    })

    it('#findDefault method returns a CashAccounts as the default one', (done : DoneFn) => {
        const expectedCashAccount : MobileMoneyAccount = buildCashAccount();
        const userEmail = 'user@gmail.com';

        httpClientSpy.get.and.returnValue(asyncData(expectedCashAccount));

        service.findDefault(userEmail).subscribe({
            next(value) {
                expect(value).toBe(expectedCashAccount);
                expect(httpClientSpy.get).toHaveBeenCalled();
                expect(httpClientSpy.get.calls.first().args[1]?.params).toEqual({
                    "owner" : userEmail
                });
                done();
            },
            error(err) {
                done.fail(err);
            },
        });
    })

    it('#findById return a CashAccount', (done : DoneFn) => {

        httpClientSpy.get.and.returnValue(asyncData(buildCashAccount()));

        service.findById(id).subscribe({
            next(value) {
                expect(value).toEqual(buildCashAccount());
                expect(httpClientSpy.get).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            },
        });
    });

    it('#update method should update a CashAccount', (done : DoneFn) => {
        const expectedCashAccount : MobileMoneyAccount = buildCashAccount();

        httpClientSpy.patch.and.returnValue(asyncData(expectedCashAccount));

        service.update(expectedCashAccount).subscribe({
            next(value) {
                expect(value).toEqual(expectedCashAccount);
                expect(httpClientSpy.patch).toHaveBeenCalled();
                expect(httpClientSpy.patch.calls.first().args[0]).toBe(`${service.resourcePath}/${expectedCashAccount.id}`);
                done();
            },
            error(err) {
                done.fail(err);
            },
        });
    });

    it('#delete method should delete a CashAccount', (done : DoneFn) => {
        const id = '454d7a6sda34354ad4s';

        httpClientSpy.delete.and.returnValue(asyncData(null));

        service.delete(id).subscribe({
            next() {
                expect().nothing();
                expect(httpClientSpy.delete).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            }
        });
    });
});



export function buildCashAccount(){
    const expectedCashAccount : MobileMoneyAccount = new MobileMoneyAccount();
    expectedCashAccount.id = '454d7a6sda34354ad4s';
    expectedCashAccount.financialAccountType = FinancialAccountType.MOBILE_MONEY;
    expectedCashAccount.mobileMoneyProvider = MobileMoneyProvider.ORANGE_MONEY_CI;
    expectedCashAccount.phoneNumber = '+2250707141516';
    expectedCashAccount.isDefault = true;
    expectedCashAccount.owner = 'user@gmail.com';

    return expectedCashAccount;
}