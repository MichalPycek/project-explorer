import { LightningElement, wire } from 'lwc';
import getAllApexClasses from '@salesforce/apex/RestExplorerController.getAllApexClasses';
const columns = [
    { label: 'Method', fieldName: 'method', type: 'text' },
];

export default class RestExplorer extends LightningElement {
    _selected = [];


    columns = columns;
    data = [];
    options = [];
    

    @wire(getAllApexClasses)
    apexClasses({error, apexClasses}){
        if(apexClasses){
            // this.options = apexClasses
            //     .filter(apexClass => apexClass.Body.includes("@RestResource"))
            //     .map(apexClass => {
            //         console.log('MPYC apexClass ', apexClass);
            //         return {
            //             label: apexClass.Name,
            //             value: apexClass.Id
            //         }
            //     });

            const filtered = Object.keys(apexClasses)
                                        .reduce((obj, key) => {
                                            obj[key] = 'Body'
                                            return obj;
                                        }, {});

            apexClasses = apexClasses.filter(apexClass => apexClass.Body.includes("@RestResource"));
            console.log('MPYC apexClasses ', apexClasses);
            this.options = apexClasses.map(apexClass => {
                console.log('MPYC apexClass ', apexClass);
                return {
                    label: apexClass.Name,
                    value: apexClass.Id
                }
            });
        } else if(error) {
            this.options = undefined;
            this.error = error;

        }

    }

    handleChange(e) {
        this._selected = e.detail.value;
    }

    
    
}