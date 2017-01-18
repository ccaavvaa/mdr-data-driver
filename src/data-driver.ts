import * as querystring from 'querystring';

const client = new (require('node-rest-client').Client)();

export interface IDataDriverOptions {
    dataUrl: string;
    dataNamespace: string;
    dataProtocol: string;
    tenantId: string;
}

export class DataDriver {

    constructor(private options: IDataDriverOptions) {
        this.options = options;
    }

    public getMany(entityName: string, filter: string): Promise<any> {
        const url = this.getFilterUrl(entityName, filter);
        return this.getDataAsync(url);
    }

    public async getOne(entityName: string, filter: string): Promise<any> {
        const result = await this.getMany(entityName, filter);

        switch (result.value.length) {
            case 0:
                return null;
            case 1:
                return result.value[0];
            default:
                throw this.getError('Too many objects', 500);
        }
    }

    // GET OBJECT BY ID
    public getObjectById(entityName: string, id: any): Promise<any> {
        const url = this.getKeyUrl(entityName, id);
        // console.log(url);
        return this.getDataAsync(url);
    }

    // INSERT Async
    public insert(entityName: string, obj: any): Promise<any> {
        const url = this.getFilterUrl(entityName, null);
        return this.postData(url, obj);
    }

    // UPDATE Async
    public update(entityName: string, obj: any): Promise<any> {
        const url = this.getKeyUrl(entityName, obj.id);
        // console.log(url);
        return this.putData(url, obj);
    }

    // DELETE Async
    public delete(entityName: string, obj: any): Promise<any> {
        const url = this.getKeyUrl(entityName, obj.id);
        // console.log(url);
        return this.deleteData(url);
    }

    private combineUrl(...args: string[]): string {
        return args.map((v) => v.replace(/\/$/, ''))
            .join('/');
    }

    private getUrl(entityName: string): string {
        return this.combineUrl(
            this.options.dataUrl,
            this.options.dataNamespace,
            this.options.dataProtocol,
            entityName,
        );
    }

    private getKeyUrl(entityName: string, key: any): string {
        const urlpart = this.getUrl(entityName);
        let urlkey = '(' + key + ')';
        if (this.options.tenantId) {
            urlkey = [urlkey, 'tenantId=' + this.options.tenantId].join('?');
        }
        return urlpart + urlkey;
    }

    private getFilterUrl(entityName: string, filter: string): string {
        const urlpart = this.getUrl(entityName);
        const filterObj: any = {
            $filter: filter,
        };
        if (this.options.tenantId) {
            filterObj.tenantId = this.options.tenantId;
        }
        const filterpart = querystring.stringify(filterObj);
        return [urlpart, filterpart].join('?');
    }

    private execute(func: any, url: string, errorMessage: string, args?: any): Promise<any> {
        const that = this;
        return new Promise<any>((resolve, reject) => {
            const callBack = (data: any, response: any) => {
                if (response.statusCode >= 400) {
                    reject(that.getError(data, response.statusCode));
                } else {
                    resolve(data);
                }
            };
            const doExec = args ?
                () => func(url, args, callBack) :
                () => func(url, callBack);
            doExec()
                .on('erreur', (err: any) => reject(that.getError(errorMessage, 500)));
        });
    }

    private createArgs(obj: any): any {
        return {
            data: obj,
            headers: { 'Content-Type': 'application/json' },
        };
    }
    // POST Async
    private postData(url: string, obj: any): Promise<any> {
        const args = this.createArgs(obj);
        return this.execute(client.post, url, 'Erreur insert serveur', args);
    }

    // PUT Async
    private putData(url: string, obj: any): Promise<any> {
        const args = this.createArgs(obj);
        return this.execute(client.put, url, 'Erreur put serveur', args);
    }

    // DELETE Async
    private deleteData(url: string): Promise<any> {
        return this.execute(client.delete, url, 'Erreur delete serveur');
    }

    // GET Async
    private getDataAsync(url: string): Promise<any> {
        return this.execute(client.get, url, 'Erreur get serveur');
    }

    private getError(message: string, code: any) {
        return {
            error: message,
            code,
        };
    }
}
