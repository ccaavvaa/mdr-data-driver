"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const chai = require("chai");
require("mocha");
const data_driver_1 = require("../data-driver");
const expect = chai.expect;
const options = {
    dataUrl: 'http://sermilappaq/data/mdr',
    dataNamespace: 'TestVirit',
    dataProtocol: 'odata',
    tenantId: '1',
};
const driver = new data_driver_1.DataDriver(options);
describe('DataDriver', () => {
    before(() => {
    });
    it('getOne', () => {
        const test = () => __awaiter(this, void 0, void 0, function* () {
            const obj = yield driver.getOne('Simple', "oid eq 'AZERT02'");
            expect(obj != null).to.be.true;
        });
        return test();
    });
});
//# sourceMappingURL=data-driver.spec.js.map