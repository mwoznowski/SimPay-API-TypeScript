import { ClientRequestBaseResponse, ClientRequestMethod } from './models/client';
import { Sms } from './payments/sms';
import { SmsXml } from './payments/sms.xml';
import { DirectBilling } from './payments/directbilling';
export declare class Client {
    private readonly BASE_URL;
    private readonly USER_AGENT;
    private httpClient;
    sms: Sms;
    smsXml: SmsXml;
    directBilling: DirectBilling;
    constructor(apiKey: string, apiPassword: string | null, timeout?: number);
    request(method: ClientRequestMethod, url: string, data?: Record<string, any>, headers?: Record<string, any>, page?: number | null, options?: Record<string, any>): Promise<ClientRequestBaseResponse<any>>;
    requestAllPagesWithoutPagination(method: ClientRequestMethod, url: string, data?: Record<string, any>, headers?: Record<string, any>, options?: Record<string, any>): Promise<ClientRequestBaseResponse<Array<any>>>;
}
