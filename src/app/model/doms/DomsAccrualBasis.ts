import { Field, Model } from "../utils/Model";

export class DomsAccrualBasis implements Model {
    
    domain!: string;
    domainDesc!: string;

    constructor() {};
    
    public readonly fields: Field[] = [
        {
            name: 'domain',
            label: 'Domain',
            type: 'text',
            length: 7,
            required: true
        }, {
            name: 'domainDesc',
            label: 'Domain Desc',
            type: 'text',
            length: 500,
            required: true
        }
    ]
}