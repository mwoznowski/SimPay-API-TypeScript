import axios, { AxiosInstance } from 'axios';
import { ClientRequestBaseResponse, ClientRequestMethod } from './models/client';
import { Sms } from './payments/sms';
import { SmsXml } from './payments/sms.xml';
import { DirectBilling } from './payments/directbilling';

export class Client {
    private readonly BASE_URL = 'https://api.simpay.pl';
    private readonly USER_AGENT = 'simpay-js-api';

    private httpClient: AxiosInstance;
    public sms: Sms;
    public smsXml: SmsXml;
    public directBilling: DirectBilling;

    constructor(apiKey: string, apiPassword: string|null, timeout: number = 5) {
        let headers: Record<string, any> = {
            'user-agent': this.USER_AGENT,
            'accept': 'application/json',
            'X-SIM-PLATFORM': 'TYPESCRIPT',
            'X-SIM-VERSION': '3.0',
            'X-SIM-KEY': apiKey,
        };

        if (apiPassword) {
            headers['X-SIM-PASSWORD'] = apiPassword as string;
        }

        this.httpClient = axios.create({
            timeout: 1000 * timeout,
            headers,
        });

        this.sms = new Sms(this);
        this.smsXml = new SmsXml(apiKey);
        this.directBilling = new DirectBilling(this);
    }

    public async request(method: ClientRequestMethod, url: string, data?: Record<string, any>, headers?: Record<string, any>, page: number|null = null, options?: Record<string, any>): Promise<ClientRequestBaseResponse<any>> {
        const finalUrl = new URL(this.BASE_URL + url);
        if (page) {
            finalUrl.searchParams.append('page', (page ?? 1).toString());
        }
        if (options?.hasOwnProperty('pageSize')) {
            finalUrl.searchParams.append('limit', options.pageSize);
        }
        
        const response = await this.httpClient.request({
            method,
            url: finalUrl.toString(),
            data,
            headers,
        });

        return response.data as ClientRequestBaseResponse<any>;
    }

    public async requestAllPagesWithoutPagination(method: ClientRequestMethod, url: string, data?: Record<string, any>, headers?: Record<string, any>, options?: Record<string, any>): Promise<ClientRequestBaseResponse<Array<any>>> {
        let request = await this.request(method, url, data, headers, 1, options);
        const response = {
            success: request.success,
            data: (request.data as Array<any>) ?? [],
        } as ClientRequestBaseResponse<Array<any>>;

        if (request.success) {
            if (response.data == undefined) {
                response.data = [];
            }

            while (request.pagination?.links.next_page) {
                request = await this.request(method, url, data, headers, request.pagination?.current_page + 1, options);
                if (request && response.data instanceof Array && request.data instanceof Array) {
                    response.data = [...response.data, ...request.data];
                }
            }
        }

        return response;
    }
}