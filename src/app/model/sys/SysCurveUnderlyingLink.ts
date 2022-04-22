import { DomsAccrualBasis } from "../doms/DomsAccrualBasis";
import { Field, Model, Relationship } from "../Model";
import { SysCurrency } from "./SysCurrency";

export class SysCurveUnderlyingLink implements Model {
    
    LinkId!: number; // TODO verify if type is correct
    underlyingCode!: string;
    curveName!: string;

    constructor() {}

    public readonly idField = 'LinkId';
    public readonly fields: Field[] = [
        {
            name: 'LinkId',
            label: 'Link Id',
            type: 'number',
            length: 999999,
            required: true
        }, {
            name: 'underlyingCode',
            label: 'Underlying Code',
            type: 'relationship',
            required: true,
            relationship: <Relationship> {
                name: 'domsAccrualBasis',
                showFields: ['domain', 'domainDesc'],
                idAttribute: 'domain',
                data: []
            }
        }, {
            name: 'curveName',
            label: 'Curve Name',
            type: 'relationship',
            required: true,
            relationship: <Relationship> {
                name: 'sysCurve',
                showFields: ['curveName', 'curveDescription'],
                idAttribute: 'LinkId',
                data: []
            }
        }
    ]
}