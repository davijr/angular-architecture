import { Field, Model, Relationship } from "../Model";

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
            length: 50,
            required: true,
            relationship: <Relationship> {
                name: 'SysUnderlying',
                showFields: ['underlyingCode', 'underlyingDescription'],
                idAttribute: 'underlyingCode',
                data: []
            }
        }, {
            name: 'curveName',
            label: 'Curve Name',
            type: 'relationship',
            length: 50,
            required: true,
            relationship: <Relationship> {
                name: 'SysCurve',
                showFields: ['curveName', 'curveDescription'],
                idAttribute: 'curveName',
                data: []
            }
        }
    ]
}