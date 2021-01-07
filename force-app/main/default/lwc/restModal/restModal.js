import { LightningElement, api } from 'lwc';

export default class RestModal extends LightningElement {
    @api selectedApexClass;
    isModalOpen = true;

    closeModalEvent = new CustomEvent('modalclosed', {
        detail: { isModalOpen: this.isModalOpen }
    });
 
    closeModal() {
        this.isModalOpen = false;
        this.dispatchEvent(this.closeModalEvent);
    }
}