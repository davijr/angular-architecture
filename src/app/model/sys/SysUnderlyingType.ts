import { Field, Model } from "../Model";

export class SysUnderlyingType implements Model {
    
    underlyingType!: string;
    underlyingTypeDescription!: string;

    constructor() {};
    
    public readonly idField = 'underlyingType';
    public readonly fields: Field[] = [
        {
            name: 'underlyingType',
            label: 'Underlying Type',
            type: 'text',
            length: 3,
            required: true
        }, {
            name: 'underlyingTypeDescription',
            label: 'Underlying Type Description',
            type: 'text',
            length: 100
        }
    ]
}