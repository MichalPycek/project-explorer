import { LightningElement, wire, track } from 'lwc';



export default class RestExplorer extends LightningElement {
    
    selectedApexClass;

    handleSelectedClass(e){
        this.selectedApexClass = e.detail;
        console.log('PAKAL PARENT selectedClass',this.selectedApexClass.label);
    }

}