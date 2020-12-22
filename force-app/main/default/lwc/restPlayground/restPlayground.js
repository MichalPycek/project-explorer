import { LightningElement, track, api } from 'lwc';
import makeRestCallout from '@salesforce/apex/RestCalloutBuilder.makeRestCallout';

const options = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
];

export default class RestPlayground extends LightningElement {
    @api selectedApexMethod;
    options = options;
    waitningForResponse = false;
    methodHasBody;

    selectedRadioButton;
    requestEndpoint;
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

    handleRadioChange(e) {
        this.selectedRadioButton = e.target.value;
        if (this.selectedRadioButton === 'GET' || this.selectedRadioButton === 'DELETE') {
            this.methodHasBody = false;
        } else {
            this.methodHasBody = true;
        }
    }

    submitDetails() {
        this.responseBody = this.response.body;
        this.responseStatusCode = this.response.statusCode;
    }

    async getResponseData() {
        this.waitningForResponse = true;
        await makeRestCallout({
            endpoint: this.selectedApexMethod.endpoint,
            type: this.selectedApexMethod.type,
            returnVal: this.selectedApexMethod.returnValue,
            params: this.selectedApexMethod.params
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
