"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const querystring = require("querystring");
const client = new (require('node-rest-client').Client)();
class DataDriver {
    constructor(options) {
        this.options = options;
        this.options = options;
    }
    getMany(entityName, filter) {
        const url = this.getFilterUrl(entityName, filter);
        return this.getDataAsync(url);
    }
    getOne(entityName, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getMany(entityName, filter);
            switch (result.value.length) {
                case 0:
                    return null;
                case 1:
                    return result.value[0];
                default:
                    throw this.getError('Too many objects', 500);
            }
        });
    }
    getObjectById(entityName, id) {
        const url = this.getKeyUrl(entityName, id);
        return this.getDataAsync(url);
    }
    insert(entityName, obj) {
        const url = this.getFilterUrl(entityName, null);
        return this.postData(url, obj);
    }
    update(entityName, obj) {
        const url = this.getKeyUrl(entityName, obj.id);
        return this.putData(url, obj);
    }
    delete(entityName, obj) {
        const url = this.getKeyUrl(entityName, obj.id);
        return this.deleteData(url);
    }
    combineUrl(...args) {
        return args.map((v) => v.replace(/\/$/, ''))
            .join('/');
    }
    getUrl(entityName) {
        return this.combineUrl(this.options.dataUrl, this.options.dataNamespace, this.options.dataProtocol, entityName);
    }
    getKeyUrl(entityName, key) {
        const urlpart = this.getUrl(entityName);
        let urlkey = '(' + key + ')';
        if (this.options.tenantId) {
            urlkey = [urlkey, 'tenantId=' + this.options.tenantId].join('?');
        }
        return urlpart + urlkey;
    }
    getFilterUrl(entityName, filter) {
        const urlpart = this.getUrl(entityName);
        const filterObj = {
            $filter: filter,
        };
        if (this.options.tenantId) {
            filterObj.tenantId = this.options.tenantId;
        }
        const filterpart = querystring.stringify(filterObj);
        return [urlpart, filterpart].join('?');
    }
    execute(func, url, errorMessage, args) {
        const that = this;
        return new Promise((resolve, reject) => {
            const callBack = (data, response) => {
                if (response.statusCode >= 400) {
                    reject(that.getError(data, response.statusCode));
                }
                else {
                    resolve(data);
                }
            };
            const doExec = args ?
                () => func(url, args, callBack) :
                () => func(url, callBack);
            doExec()
                .on('erreur', (err) => reject(that.getError(errorMessage, 500)));
        });
    }
    createArgs(obj) {
        return {
            data: obj,
            headers: { 'Content-Type': 'application/json' },
        };
    }
    postData(url, obj) {
        const args = this.createArgs(obj);
        return this.execute(client.post, url, 'Erreur insert serveur', args);
    }
    putData(url, obj) {
        const args = this.createArgs(obj);
        return this.execute(client.put, url, 'Erreur put serveur', args);
    }
    deleteData(url) {
        return this.execute(client.delete, url, 'Erreur delete serveur');
    }
    getDataAsync(url) {
        return this.execute(client.get, url, 'Erreur get serveur');
    }
    getError(message, code) {
        return {
            error: message,
            code,
        };
    }
}
exports.DataDriver = DataDriver;
//# sourceMappingURL=data-driver.js.map