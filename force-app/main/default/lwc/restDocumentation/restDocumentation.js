import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Method Name', fieldName: 'name', type: 'text', initialWidth: 150 },
    { label: 'Method Type', fieldName: 'type', type: 'text', initialWidth: 150 },
    { label: 'Endpoint', fieldName: 'endpoint', type: 'text', initialWidth: 150 }
];

export default class RestDocumentation extends LightningElement {
    columns = columns;
    @api classData;
    methodInfo;

    getSelectedRow(e) {
        this.methodInfo = e.detail.selectedRows[0];
    }
}
