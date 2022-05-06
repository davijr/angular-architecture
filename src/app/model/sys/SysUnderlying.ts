import { DomsAccrualBasis } from "../doms/DomsAccrualBasis";
import { Field, Model, Relationship } from "../Model";
import { SysCurrency } from "./SysCurrency";
import { SysUnderlyingType } from "./SysUnderlyingType";

export class SysUnderlying implements Model {
    
    underlyingCode!: string;
    underlyingDescription!: string;
    underlyingCcy!: SysCurrency;
    underlyingType!: SysUnderlyingType;
    underlyingTickerBbg!: string;
    underlyingTickerRfntvt!: string;
    underlyingInitialDate!: Date;
    underlyingEndDate!: Date;

    constructor() {}

    public readonly idField = 'underlyingCode';
    public readonly fields: Field[] = [
        {
            name: 'underlyingCode',
            label: 'Underlying Code',
            type: 'text',
            length: 50,
            required: true
        }, {
            name: 'underlyingDescription',
            label: 'Underlying Description',
            type: 'text',
            length: 255
        }, {
            name: 'underlyingCcy',
            label: 'Underlying CCY',
            required: true,
            type: 'relationship',
            relationship: <Relationship> {
                name: 'SysCurrency',
                showFields: ['currencyCode', 'currencyName'],
                idAttribute: 'currencyCode',
                data: []
            }
        }, {
            name: 'underlyingType',
            label: 'Underlying Type',
            required: true,
            type: 'relationship',
            relationship: <Relationship> {
                name: 'SysUnderlyingType',
                showFields: ['underlyingType', 'underlyingTypeDescription'],
                idAttribute: 'underlyingType',
                data: []
            }
        }, {
            name: 'underlyingTickerBbg',
            label: 'Underlying Ticker BBG',
            type: 'text',
            length: 200
        }, {
            name: 'underlyingDescription',
            label: 'Underlying Description',
            type: 'text',
            length: 200
        }, {
            name: 'underlyingInitialDate',
            label: 'Underlying Initial Date',
            required: true,
            type: 'date'
        }, {
            name: 'underlyingEndDate',
            label: 'Underlying End Date',
            type: 'date'
        }
    ]
}