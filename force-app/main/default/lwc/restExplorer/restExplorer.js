import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
    @track selectedApexClass;
    selectedApexMethod;
    @track unselectDatatable;

    handleSelectedClass(e) {
        this.selectedApexClass = e.detail;
    }

    handleSelectedRow(e) {
        this.selectedApexMethod = e.detail;
    }

    handleUnselectDataTable(){
        this.unselectDatatable = true;
        console.log('Unselected DATATABLE!!');
        this.template.querySelector("c-rest-documentation").handleRowSelection();
    }
}
