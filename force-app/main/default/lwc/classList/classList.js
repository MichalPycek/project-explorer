import { LightningElement, wire } from 'lwc';
import getAllApexClasses from '@salesforce/apex/RestExplorerController.getAllApexClasses';

const CLASS_ANNOTATION = '@restresource';

export default class ClassList extends LightningElement {
    filterInput = '';
    selectedApexClass;
    classOptions = [];

    @wire(getAllApexClasses, { filterVal: '$filterInput' })
    apexClasses({ error, data }) {
        if (data) {
            this.classOptions = data
                .filter((apexClass) => apexClass.Body.toLowerCase().includes(CLASS_ANNOTATION))
                .map((apexClass) => {
                    return {
                        label: apexClass.Name,
                        value: apexClass.Id,
                        body: apexClass.Body.toLowerCase(),
                        bodyWithCase: apexClass.Body
                    };
                });
        } else if (error) {
            this.error = error;
        }
    }

    handleFilter(e) {
        this.filterInput = e.detail.value;
    }

    handleItemSelect(e) {
        this.selectedApexClass = this.classOptions.find((option) => option.label === e.detail.name);
        const selectedClassEvent = new CustomEvent('selectedclass', {
            detail: {
                value: this.selectedApexClass.value,
                label: this.selectedApexClass.label,
                body: this.selectedApexClass.body,
                bodyWithCase : this.selectedApexClass.bodyWithCase
            }
        });
        this.dispatchEvent(selectedClassEvent);
    }
}