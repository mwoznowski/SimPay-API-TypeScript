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
exports.Client = void 0;
const axios_1 = require("axios");
const sms_1 = require("./payments/sms");
const sms_xml_1 = require("./payments/sms.xml");
const directbilling_1 = require("./payments/directbilling");
class Client {
    constructor(apiKey, apiPassword, timeout = 5) {
        this.BASE_URL = 'https://api.simpay.pl';
        this.USER_AGENT = 'simpay-js-api';
        let headers = {
            'user-agent': this.USER_AGENT,
            'accept': 'application/json',
            'X-SIM-PLATFORM': 'TYPESCRIPT',
            'X-SIM-VERSION': '3.0',
            'X-SIM-KEY': apiKey,
        };
        if (apiPassword) {
            headers['X-SIM-PASSWORD'] = apiPassword;
        }
        this.httpClient = axios_1.default.create({
            timeout: 1000 * timeout,
            headers,
        });
        this.sms = new sms_1.Sms(this);
        this.smsXml = new sms_xml_1.SmsXml(apiKey);
        this.directBilling = new directbilling_1.DirectBilling(this);
    }
    request(method, url, data, headers, page = null, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalUrl = new URL(this.BASE_URL + url);
            if (page) {
                finalUrl.searchParams.append('page', (page !== null && page !== void 0 ? page : 1).toString());
            }
            if (options === null || options === void 0 ? void 0 : options.hasOwnProperty('pageSize')) {
                finalUrl.searchParams.append('limit', options.pageSize);
            }
            const response = yield this.httpClient.request({
                method,
                url: finalUrl.toString(),
                data,
                headers,
            });
            return response.data;
        });
    }
    requestAllPagesWithoutPagination(method, url, data, headers, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let request = yield this.request(method, url, data, headers, 1, options);
            const response = {
                success: request.success,
                data: (_a = request.data) !== null && _a !== void 0 ? _a : [],
            };
            if (request.success) {
                if (response.data == undefined) {
                    response.data = [];
                }
                while ((_b = request.pagination) === null || _b === void 0 ? void 0 : _b.links.next_page) {
                    request = yield this.request(method, url, data, headers, ((_c = request.pagination) === null || _c === void 0 ? void 0 : _c.current_page) + 1, options);
                    if (request && response.data instanceof Array && request.data instanceof Array) {
                        response.data = [...response.data, ...request.data];
                    }
                }
            }
            return response;
        });
    }
}
exports.Client = Client;
