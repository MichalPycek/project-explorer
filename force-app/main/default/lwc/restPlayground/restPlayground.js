import { LightningElement, track, api } from 'lwc';
import makeRestCallout from '@salesforce/apex/RestCalloutBuilder.makeRestCallout';

const OPTIONS = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
];

const UNSELECTDATATABLEEVENT = new CustomEvent('unselectdatatable');

export default class RestPlayground extends LightningElement {
    @api selectedApexMethod;
    options = OPTIONS;
    waitningForResponse = false;
    methodHasBody;

    
    selectedRadioButton;
    requestEndpoint;
    returnValue;

    responseBody = 'No Body';
    responseStatusCode = 'No Status Code';

    @track response;
    @track error;

    

    get selectedMethodType() {
        if (this.selectedApexMethod) {
            this.selectedRadioButton = this.selectedApexMethod.type.trim();
        }

        return this.selectedRadioButton;
    }

    get selectedMethodEndpoint() {
        if (this.selectedApexMethod) {
            this.requestEndpoint = this.selectedApexMethod.endpoint;
        } 
        return this.requestEndpoint;
    }
    
    get selectedReturnValue() {
        if(this.selectedApexMethod){
            this.returnValue = this.selectedApexMethod.returnValue;
        } else {
            this.returnValue = '';
        }
        return this.returnValue;
    }



    handleRadioChange(e) {
        if(this.selectedApexMethod){
            this.selectedApexMethod = undefined;
            this.dispatchEvent(UNSELECTDATATABLEEVENT);
        }

        this.selectedRadioButton = e.target.value;

        if (this.selectedRadioButton === 'GET' || this.selectedRadioButton === 'DELETE') {
            this.methodHasBody = false;
        } else {
            this.methodHasBody = true;
        }
    }

    handleEndpointChange(e){
        if(this.selectedApexMethod){
            this.selectedApexMethod = undefined;
            this.dispatchEvent(UNSELECTDATATABLEEVENT);
        }
        this.requestEndpoint = e.target.value;
    }

    submitDetails() {
        this.responseBody = this.response.body;
        this.responseStatusCode = this.response.statusCode;
    }

    async getResponseData() {
        this.waitningForResponse = true;
        
        console.log('PAKAL selected endpoint ' + this.requestEndpoint);
        console.log('PAKAL selected method type ' + this.selectedRadioButton);    
        console.log('PAKAL selected return type ' + this.selectedReturnValue);

        await makeRestCallout({
            endpoint: this.selectedMethodEndpoint,
            type: this.selectedMethodType,
            returnVal: this.selectedReturnValue
        })
            .then((result) => {
                this.response = result;
                this.submitDetails();
            })
            .catch((error) => {
                this.error = error;
            });

        this.waitningForResponse = false;
    }
}
