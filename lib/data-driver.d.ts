export interface IDataDriverOptions {
    dataUrl: string;
    dataNamespace: string;
    dataProtocol: string;
    tenantId: string;
}
export declare class DataDriver {
    private options;
    constructor(options: IDataDriverOptions);
    getMany(entityName: string, filter: string): Promise<any>;
    getOne(entityName: string, filter: string): Promise<any>;
    getObjectById(entityName: string, id: any): Promise<any>;
    insert(entityName: string, obj: any): Promise<any>;
    update(entityName: string, obj: any): Promise<any>;
    delete(entityName: string, obj: any): Promise<any>;
    private combineUrl(...args);
    private getUrl(entityName);
    private getKeyUrl(entityName, key);
    private getFilterUrl(entityName, filter);
    private execute(func, url, errorMessage, args?);
    private createArgs(obj);
    private postData(url, obj);
    private putData(url, obj);
    private deleteData(url);
    private getDataAsync(url);
    private getError(message, code);
}
