import { DomsAccrualBasis } from "../doms/DomsAccrualBasis";
import { Field, Model, Relationship } from "../utils/Model";
import { SysCurrency } from "./SysCurrency";

export class SysExternalSystem implements Model {
    
    curveName!: string;
    curveDescription!: string;
    accrualBasis!: DomsAccrualBasis;
    currencyCode!: SysCurrency;

    constructor() {}

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
                name: 'domsAccrualBasis',
                showFields: ['domain', 'domainDesc'],
                idAttribute: 'domain',
                data: []
            }
        }, {
            name: 'currencyCode',
            label: 'Currency Code',
            type: 'relationship',
            relationship: <Relationship> {
                name: 'sysCurrency',
                showFields: ['currencyCode', 'currencyName'],
                idAttribute: 'currencyCode',
                data: []
            }
        }
    ]
}