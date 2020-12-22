import { LightningElement, track } from 'lwc';
import makeRestCallout from '@salesforce/apex/RestCalloutBuilder.makeRestCallout';

const options = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
];

export default class RestPlayground extends LightningElement {
    options = options;
    waitningForResponse = false;
    requestParams = {
        endpoint: '/Opportunity/',
        params: 'No Input Parameters',
        returnValue: 'void',
        type: 'GET'
    };
    responseBody = 'No Body';
    responseStatusCode = 'No Status Code';

    @track response;
    @track error;

    submitDetails() {
        this.responseBody = this.response.body;
        this.responseStatusCode = this.response.statusCode;
    }

    async getResponseData() {
        this.waitningForResponse = true;
        await makeRestCallout({
            endpoint: this.requestParams.endpoint,
            type: this.requestParams.type,
            returnVal: this.requestParams.returnValue,
            params: this.requestParams.params
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
