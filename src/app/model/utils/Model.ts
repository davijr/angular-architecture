
export interface Model {
    readonly fields: Field[];
}

export interface Field {
    name: string;
    label: string;
    type: ('text' | 'number' | 'email' | 'date' | 'relationship');
    length?: number;
    required?: boolean;
    relationship?: Relationship;
}

export interface Relationship {
    name: string;
    idAttribute: string;
    showFields: string[];
    data?: any[];
}