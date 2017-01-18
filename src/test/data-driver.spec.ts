import * as chai from 'chai';
import 'mocha';

import { DataDriver, IDataDriverOptions } from '../data-driver';

const expect = chai.expect;

const options: IDataDriverOptions = {
    dataUrl: 'http://sermilappaq/data/mdr',
    dataNamespace: 'TestVirit',
    dataProtocol: 'odata',
    tenantId: '1',
};

const driver = new DataDriver(options);
describe('DataDriver', () => {
    before(() => {
        // to init database
    });

    it('getOne', () => {
        const test = async (): Promise<void> => {
            const obj = await driver.getOne('Simple', "oid eq 'AZERT02'");
            expect(obj != null).to.be.true;
        };
        return test();
    });
});
