"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sms = void 0;
const client_1 = require("../models/client");
class Sms {
    constructor(client) {
        this.client = client;
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-uslug
     */
    getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.requestAllPagesWithoutPagination(client_1.ClientRequestMethod.GET, '/sms');
            return response.data.map((e) => {
                e.created_at = new Date(e.created_at.replace(' ', 'T'));
                return e;
            });
        });
    }
    getServicesPaginated(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request(client_1.ClientRequestMethod.GET, '/sms', undefined, undefined, page !== null && page !== void 0 ? page : 1, {
                pageSize: pageSize !== null && pageSize !== void 0 ? pageSize : 15
            });
            response.data = response.data.map((e) => {
                e.created_at = new Date(e.created_at.replace(' ', 'T'));
                return e;
            });
            return response;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-usludze
     */
    getService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request(client_1.ClientRequestMethod.GET, '/sms/' + id);
            if (response.data && response.data.hasOwnProperty('created_at')) {
                response.data.created_at = new Date(response.data.created_at.replace(' ', 'T'));
            }
            return response.data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-transakcji
     */
    getTransactions(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.requestAllPagesWithoutPagination(client_1.ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions');
            return response.data.map((e) => {
                e.send_at = new Date(e.send_at.replace(' ', 'T'));
                return e;
            });
        });
    }
    getTransactionsPaginated(serviceId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request(client_1.ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions', undefined, undefined, page !== null && page !== void 0 ? page : 1, {
                pageSize: pageSize !== null && pageSize !== void 0 ? pageSize : 15
            });
            response.data = response.data.map((e) => {
                e.send_at = new Date(e.send_at.replace(' ', 'T'));
                return e;
            });
            return response;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-transakcji
     */
    getTransaction(serviceId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request(client_1.ClientRequestMethod.GET, '/sms/' + serviceId + '/transactions/' + transactionId);
            if (response.data && response.data.hasOwnProperty('created_at')) {
                response.data.send_at = new Date(response.data.send_at.replace(' ', 'T'));
            }
            return response.data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-dostepnych-numerow-dla-uslugi
     */
    getServiceNumbers(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.requestAllPagesWithoutPagination(client_1.ClientRequestMethod.GET, '/sms/' + serviceId + '/numbers');
            return response.data;
        });
    }
    getServiceNumbersPaginated(serviceId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (page)
                query.page = `${page}`;
            if (pageSize)
                query.limit = `${pageSize}`;
            const url = `/${serviceId}/numbers?${new URLSearchParams(query).toString()}`;
            return (yield this.client.get(url)).data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-informacji-o-pojedynczym-numerze-uslugi
     */
    getServiceNumber(serviceId, number) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.get(`/${serviceId}/numbers/${number}`)).data.data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-wszystkich-dostepnych-numerow
     */
    getNumbers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            let response = yield this.client.get('/numbers');
            result.push(...response.data.data);
            while (response.data.pagination.links.next_page !== null) {
                response = yield this.client.get(`/numbers?page=${response.data.pagination.current_page + 1}`);
                result.push(...response.data.data);
            }
            return result;
        });
    }
    getNumbersPaginated(page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (page)
                query.page = `${page}`;
            if (pageSize)
                query.limit = `${pageSize}`;
            const url = `/numbers?${new URLSearchParams(query).toString()}`;
            return (yield this.client.get(url)).data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-pojedynczego-numeru-sms
     */
    getNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.get(`/numbers/${number}`)).data.data;
        });
    }
    /*
        https://docs.simpay.pl/pl/typescript/?typescript#sms-weryfikacja-poprawnosci-kodu
     */
    verifySmsCode(serviceId, code, number) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request(client_1.ClientRequestMethod.POST, '/sms/' + serviceId, {
                code,
                number,
            });
            if (response.data.used_at) {
                response.data.used_at = new Date(response.data.used_at.replace(' ', 'T'));
            }
            return response.data;
        });
    }
}
exports.Sms = Sms;
