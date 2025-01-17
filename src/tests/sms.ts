import { Client } from "../client";
import { Sms } from "../payments/sms";

const run = async () => {
    const client = new Client("d0d60036", "28adf7103a810b400548e306cb96b2b4");

    // console.log(await client.sms.getServices());
    // console.log(await client.sms.getServicesPaginated());
    // console.log(await client.sms.getService('ccbc4b7a'));
    // console.log(await client.sms.getTransactions('ccbc4b7a'));
    console.log(await client.sms.getServiceNumbers('ccbc4b7a'));
    // console.log(await client.sms.getTransactionsPaginated('ccbc4b7a'));
    // console.log(await client.sms.verifySmsCode('ccbc4b7a', '4D9A52'));
    
    // const sms = new Sms('0b4dca15', '3eea38f407073ff0abff956b57d71783');

    // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-uslug
    // console.log( await sms.getServices() );
    // console.log( await sms.getServicesPaginated(1, 100));

    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-usludze
    // console.log( await sms.getService(3549));

    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-listy-transakcji
    // console.log( await sms.getTransactions(3549));
    // console.log( await sms.getTransactionsPaginated(3549, 1, 100));

    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-informacji-o-transakcji
    // console.log( await sms.getTransaction(3549, 2216609));

    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-dostepnych-numerow-dla-uslugi
    // console.log( await sms.getServiceNumbers(3549));
    // console.log( await sms.getServiceNumbersPaginated(3549, 1, 100));

    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-informacji-o-pojedynczym-numerze-uslugi
    // console.log( await sms.getServiceNumber(3549, 7055));
    
    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-wszystkich-dostepnych-numerow
    // console.log( await sms.getNumbers());
    // console.log( await sms.getNumbersPaginated(1, 100));
    
    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-pobieranie-pojedynczego-numeru-sms
    // console.log( await sms.getNumber(7055));
    
    // // https://docs.simpay.pl/pl/typescript/?typescript#sms-weryfikacja-poprawnosci-kodu
    // console.log( await sms.verifySmsCode(3549, '81FFC5', 7055));
    // console.log( await sms.verifySmsCode(3549, '81FFC5'));
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
void run();