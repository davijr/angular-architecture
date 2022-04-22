import { Field, Model } from "../Model";

export class DomsCcyConvType implements Model {
    
    domain!: string;
    domainDesc!: string;

    constructor() {};
    
    public readonly idField = 'domain';
    public readonly fields: Field[] = [
        {
            name: 'domain',
            label: 'Domain',
            type: 'text',
            length: 1,
            required: true
        }, {
            name: 'domainDesc',
            label: 'Domain Desc',
            type: 'text',
            length: 500
        }
    ]
}