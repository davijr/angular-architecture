import { Field, Model, Relationship } from "../Model";
import { DomsSystemType } from "../doms/DomsSystemType";

export class SysExternalSystem implements Model {
    
    sourceSystem!: string;
    sourceSystemName!: string;
    systemType!: DomsSystemType;

    constructor() {}

    public readonly idField = 'sourceSystem';
    public readonly fields: Field[] = [
        {
            name: 'sourceSystem',
            label: 'Source System',
            type: 'text',
            length: 30,
            required: true
        }, {
            name: 'sourceSystemName',
            label: 'Source System Name',
            type: 'text',
            length: 50
        }, {
            name: 'systemType',
            label: 'System Type',
            length: 2,
            type: 'relationship',
            relationship: <Relationship> {
                name: 'DomsSystemType',
                showFields: ['domain', 'domainDesc'],
                idAttribute: 'domain',
                data: []
            }
        }
    ]
}