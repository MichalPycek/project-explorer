import { LightningElement, api, wire, track } from 'lwc';
import makeRestCallout from '@salesforce/apex/RestCalloutBuilder.makeRestCallout';

export default class RestModal extends LightningElement {
    @api requestParams;
    responseParams = 'test';
    isModalOpen = true;
    spinnerLoading;

    closeModalEvent = new CustomEvent('modalclosed', {
        detail: { isModalOpen: this.isModalOpen }
    });
 
    @track response;
    @track error;

    // @wire(makeRestCallout, {
    //     endpoint: '$requestParams.endpoint',
    //     type: '$requestParams.type',
    //     returnVal: '$requestParams.returnValue',
    //     params: '$requestParams.params'
    // })
    // response;

    getResponseData() {
        this.stillLoading();
        makeRestCallout({
            endpoint: this.requestParams.endpoint,
            type: this.requestParams.type,
            returnVal: this.requestParams.returnValue,
            params : this.requestParams.params
        })
            .then(result => {  
                this.response = result;
                this.submitDetails();
            })
            .catch(error => {
                this.error = error;
            });
    }

    doneLoading() {
        const doneLoadingEvent = new CustomEvent("doneloading");
        this.dispatchEvent(doneLoadingEvent);
      }
    
    stillLoading(){
        const stillLoadingEvent = new CustomEvent("stillloading");
        this.dispatchEvent(stillLoadingEvent);
    }

    closeModal() {
        this.isModalOpen = false;
        this.dispatchEvent(this.closeModalEvent);
    }

    submitDetails() {
        this.isModalOpen = false;
        this.dispatchEvent(this.closeModalEvent);

        const responseEvent = new CustomEvent('response', {
            detail: { body: this.response.body, statusCode: this.response.statusCode }
        });
        this.dispatchEvent(responseEvent);
        this.doneLoading();
    }
}
