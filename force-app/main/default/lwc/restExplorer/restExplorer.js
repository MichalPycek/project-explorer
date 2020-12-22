import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
    @track selectedApexClass;

    handleSelectedClass(e) {
        this.selectedApexClass = e.detail;
    }
}
