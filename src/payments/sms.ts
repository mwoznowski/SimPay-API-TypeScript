import {SmsService} from '../models/sms/service/sms.service';
import {SmsTransaction} from '../models/sms/transaction/sms.transaction';
import {SmsNumber} from '../models/sms/service/sms.number';
import {PaginatedResponse} from '../models/response/paginated.response';
import {VerificationResponse} from '../models/sms/verification.response';
import { Client } from '../client';
import { ClientRequestBaseResponse, ClientRequestMethod } from '../models/client';

export class Sms {
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-uslug
     */
    async getServices(): Promise<SmsService[]> {
        const response = await this.client.requestAllPagesWithoutPagination(ClientRequestMethod.GET, '/sms');
        return response.data.map((e: SmsService) => {
            e.created_at = new Date((e.created_at as unknown as string).replace(' ', 'T'));
            return e;
        });
    }

    async getServicesPaginated(page?: number, pageSize?: number): Promise<ClientRequestBaseResponse<SmsService[]>> {
        const response = await this.client.request(ClientRequestMethod.GET, '/sms', undefined, undefined, page ?? 1, {
            pageSize: pageSize ?? 15
        }) as ClientRequestBaseResponse<SmsService[]>;
        
        response.data = response.data.map((e: SmsService) => {
            e.created_at = new Date((e.created_at as unknown as string).replace(' ', 'T'));
            return e;
        });

        return response;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-usludze
     */
    async getService(id: string): Promise<SmsService | undefined> {
        const response = await this.client.request(ClientRequestMethod.GET, '/sms/' + id) as ClientRequestBaseResponse<SmsService>;
        if (response.data && response.data.hasOwnProperty('created_at')) {
            (response.data as SmsService).created_at = new Date((response.data.created_at as unknown as string).replace(' ', 'T'));
        }

        return response.data as SmsService;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-transakcji
     */
    async getTransactions(serviceId: string|string): Promise<SmsTransaction[]> {
        const response = await this.client.requestAllPagesWithoutPagination(ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions');

        return response.data.map((e: SmsTransaction) => {
            e.send_at = new Date((e.send_at as unknown as string).replace(' ', 'T'));
            return e;
        });
    }

    async getTransactionsPaginated(serviceId: string, page?: number, pageSize?: number): Promise<ClientRequestBaseResponse<SmsTransaction[]>> {
        const response = await this.client.request(ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions', undefined, undefined, page ?? 1, {
            pageSize: pageSize ?? 15
        }) as ClientRequestBaseResponse<SmsTransaction[]>;

        response.data = response.data.map((e: SmsTransaction) => {
            e.send_at = new Date((e.send_at as unknown as string).replace(' ', 'T'));
            return e;
        });

        return response;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-transakcji
     */
    async getTransaction(serviceId: string, transactionId: number): Promise<SmsTransaction | undefined> {
        const response = await this.client.request(ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions/' + transactionId) as ClientRequestBaseResponse<SmsTransaction>;
        if (response.data && response.data.hasOwnProperty('created_at')) {
            (response.data as SmsTransaction).send_at = new Date((response.data.send_at as unknown as string).replace(' ', 'T'));
        }

        return response.data as SmsTransaction;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-dostepnych-numerow-dla-uslugi
     */
    async getServiceNumbers(serviceId: string): Promise<SmsNumber[]> {
        const response = await this.client.requestAllPagesWithoutPagination(ClientRequestMethod.GET, '/sms/' + serviceId + '/numbers') as ClientRequestBaseResponse<SmsNumber[]>;
        return response.data;
    }

    async getServiceNumbersPaginated(serviceId: string, page?: number, pageSize?: number): Promise<ClientRequestBaseResponse<SmsNumber[]>> {
        return await this.client.request(ClientRequestMethod.GET, '/sms/' + serviceId + '/numbers') as ClientRequestBaseResponse<SmsNumber[]>;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-informacji-o-pojedynczym-numerze-uslugi
     */
    async getServiceNumber(serviceId: string, number: number): Promise<SmsNumber> {
        const response = await this.client.request(ClientRequestMethod.GET, '/sms/' + serviceId + '/numbers/' + number) as ClientRequestBaseResponse<SmsNumber>;
        
        return response.data;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-wszystkich-dostepnych-numerow
     */
    async getNumbers(): Promise<SmsNumber[]> {
        const result = [];

        let response = await this.client.get('/numbers');

        result.push(...response.data.data);

        while(response.data.pagination.links.next_page !== null) {
            response = await this.client.get(`/numbers?page=${(<number> response.data.pagination.current_page) + 1}`);

            result.push(...response.data.data);
        }

        return result;
    }

    async getNumbersPaginated(page?: number, pageSize?: number): Promise<PaginatedResponse<SmsNumber>> {
        const query: any = {};

        if (page) query.page = `${page}`;
        if (pageSize) query.limit = `${pageSize}`;

        const url = `/numbers?${new URLSearchParams(query).toString()}`;

        return (await this.client.get(url)).data;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-pojedynczego-numeru-sms
     */
    async getNumber(number: number): Promise<SmsNumber | undefined> {
        return (await this.client.get(`/numbers/${number}`)).data.data;
    }

    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-weryfikacja-poprawnosci-kodu
     */
    async verifySmsCode(serviceId: string, code: string, number?: number): Promise<VerificationResponse | undefined> {
        const response = await this.client.request(ClientRequestMethod.POST, '/sms/' + serviceId, {
            code,
            number,
        }) as ClientRequestBaseResponse<VerificationResponse>;
        if (response.data.used_at) {
            response.data.used_at = new Date((response.data.used_at as unknown as string).replace(' ', 'T'));
        }

        return response.data;
    }
}