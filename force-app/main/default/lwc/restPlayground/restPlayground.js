import { LightningElement, track, api } from 'lwc';
import makeRestCallout from '@salesforce/apex/RestCalloutBuilder.makeRestCallout';

const OPTIONS = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' }
];

const GETMETHODSTRING = 'GET';
const DELETEMETHODSTRING = 'DELETE';

const UNSELECTDATATABLEEVENT = new CustomEvent('unselectdatatable');

export default class RestPlayground extends LightningElement {
    @api selectedApexMethod;
    options = OPTIONS;
    waitningForResponse = false;
    methodHasBody;

    selectedRadioButton;
    requestEndpoint;
    returnValue;
    requestBody;

    responseBody;
    responseStatusCode;

    @track response;
    @track error;


    get selectedMethodType() {
        if (this.selectedApexMethod) {
            this.selectedRadioButton = this.selectedApexMethod.type.trim();
            this.methodHasBody = this.checkMethodHasBody(this.selectedRadioButton);
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
        if (this.selectedApexMethod) {
            this.returnValue = this.selectedApexMethod.returnValue;
        } else {
            this.returnValue = '';
        }
        return this.returnValue;
    }

    handleRadioChange(e) {
        if (this.selectedApexMethod) {
            this.selectedApexMethod = undefined;
            this.dispatchEvent(UNSELECTDATATABLEEVENT);
        }

        this.selectedRadioButton = e.target.value;

        this.methodHasBody = this.checkMethodHasBody(this.selectedRadioButton);
    }

    handleEndpointChange(e) {
        if (this.selectedApexMethod) {
            this.selectedApexMethod = undefined;
            this.dispatchEvent(UNSELECTDATATABLEEVENT);
        }
        this.requestEndpoint = e.target.value;
    }

    handleBodyChange(e) {
        this.requestBody = e.target.value;
    }

    submitDetails() {
        this.responseBody = this.response.body;
        this.responseStatusCode = this.response.statusCode;
        this.error = undefined;
        this.notifySpinnerLoading(false);
    }

    checkMethodHasBody(selectedMethod) {
        return !(selectedMethod === GETMETHODSTRING || selectedMethod === DELETEMETHODSTRING);
         
    }

    checkFormValidity(){
        return (!this.requestBody && this.methodHasBody) || !this.selectedMethodEndpoint || !this.selectedMethodType;
    }

    async getResponseData() {

        if(this.checkFormValidity()){
            this.error = 'Opps.. make sure you fill out the form before sending the request';
        } else {
        this.notifySpinnerLoading(true);
        this.waitningForResponse = true;
        await makeRestCallout({
            endpoint: this.selectedMethodEndpoint,
            type: this.selectedMethodType,
            returnVal: this.selectedReturnValue,
            body: this.requestBody
        })
            .then((result) => {
                this.response = result;
                this.submitDetails();
            })
            .catch((error) => {
                this.error = error;
                this.notifySpinnerLoading(false);
            });

        this.waitningForResponse = false;
    }
    }

    notifySpinnerLoading(isLoading) {
        this.isSpinnerLoading = isLoading;
        if (this.isSpinnerLoading) {
            this.dispatchEvent(new CustomEvent('spinnerloading'));
        } else {
            this.dispatchEvent(new CustomEvent('spinnerdoneloading'));
        }
    }
}