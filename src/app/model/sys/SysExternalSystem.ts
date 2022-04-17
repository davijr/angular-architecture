import { Field, Model, Relationship } from "../utils/Model";
import { DomsSystemType } from "../doms/DomsSystemType";

export class SysExternalSystem implements Model {
    
    sourceSystem!: string;
    sourceSystemName!: string;
    systemType!: DomsSystemType;

    constructor() {}

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
            type: 'relationship',
            relationship: <Relationship> {
                name: 'domsSystemType',
                showFields: ['domain', 'domainDesc'],
                idAttribute: 'domain',
                data: []
            }
        }
    ]
}