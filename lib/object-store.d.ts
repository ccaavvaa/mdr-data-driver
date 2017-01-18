export declare type IdType = string | number;
export interface IObjectStore {
    getOne(collectionKey: any, filter: any): Promise<any>;
    getMany(collectionKey: any, filter: any): Promise<any[]>;
    getNewId(collectionKey: any): Promise<IdType>;
    reset(): void;
}
