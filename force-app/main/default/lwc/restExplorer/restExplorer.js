import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
    @track selectedApexClass;
    selectedApexMethod;

    handleSelectedClass(e) {
        this.selectedApexClass = e.detail;
    }

    handleSelectedRow(e) {
        this.selectedApexMethod = e.detail;
    }
}
