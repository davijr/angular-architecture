import { DomsAccrualBasis } from "../doms/DomsAccrualBasis";
import { Field, Model, Relationship } from "../Model";
import { SysCurrency } from "./SysCurrency";

export class SysCurve implements Model {
    
    curveName!: string;
    curveDescription!: string;
    accrualBasis!: DomsAccrualBasis;
    currencyCode!: SysCurrency;

    constructor() {}

    public readonly idField = 'curveName';
    public readonly fields: Field[] = [
        {
            name: 'curveName',
            label: 'Curve Name',
            type: 'text',
            length: 30,
            required: true
        }, {
            name: 'curveDescription',
            label: 'Curve Description',
            type: 'text',
            length: 50
        }, {
            name: 'accrualBasis',
            label: 'Accrual Basis',
            type: 'relationship',
            relationship: <Relationship> {
                name: 'DomsAccrualBasis',
                showFields: ['domain'],
                idAttribute: 'domain',
                data: []
            }
        }, {
            name: 'currencyCode',
            label: 'Currency Code',
            type: 'relationship',
            relationship: <Relationship> {
                name: 'SysCurrency',
                showFields: ['currencyCode', 'currencyName'],
                idAttribute: 'currencyCode',
                data: []
            }
        }
    ]
}