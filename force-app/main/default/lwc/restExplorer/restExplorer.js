import { LightningElement, track } from 'lwc';

export default class RestExplorer extends LightningElement {
    @track selectedApexClass;
    selectedApexMethod;
    @track unselectDatatable;
    isSpinnerLoading = false;

    handleSpinnerLoading(){
        this.isSpinnerLoading = true;
    } 

    handleSpinnerDoneLoading(){
        this.isSpinnerLoading = false;
    }

    handleSelectedClass(e) {
        this.selectedApexClass = e.detail;
    }

    handleSelectedRow(e) {
        this.selectedApexMethod = e.detail;
    }

    handleUnselectDataTable(){
        this.unselectDatatable = true;
        this.template.querySelector("c-rest-documentation").handleRowUnselection();
    }

    
}