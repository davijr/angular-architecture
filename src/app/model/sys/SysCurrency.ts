import { DomsCcyConvType } from "../doms/DomsCcyConvType";
import { Field, Model, Relationship } from "../utils/Model";

export class SysCurrency implements Model {
    
    currencyCode!: string;
    currencyName!: string;
    currencyConvType!: DomsCcyConvType;
    currencyNumericBacenCode!: number;
    recordInitialDate!: Date;
    recordEndDate!: Date;

    constructor() {};
    
    public readonly fields: Field[] = [
        {
            name: 'currencyCode',
            label: 'Currency Code',
            type: 'text',
            length: 3,
            required: true
        }, {
            name: 'currencyName',
            label: 'Currency Name',
            type: 'text',
            length: 100,
            required: true
        }, {
            name: 'currencyConvType',
            label: 'Currency Conv Type',
            required: true,
            type: 'relationship',
            relationship: <Relationship> {
                name: 'domsCcyConvType',
                showFields: ['domain', 'domainDesc'],
                idAttribute: 'domain',
                data: []
            }
        }, {
            name: 'currencyNumericBacenCode',
            label: 'Currency Numeric Bacen Code',
            type: 'number',
            length: 4
        }, {
            name: 'recordInitialDate',
            label: 'Record Initial Date',
            type: 'date'
        }, {
            name: 'recordEndDate',
            label: 'Record End Date',
            type: 'date'
        }
    ]
}