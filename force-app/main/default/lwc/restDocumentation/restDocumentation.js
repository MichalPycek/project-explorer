import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Method Type', fieldName: 'type', type: 'text', initialWidth: 130 },
    { label: 'Return', fieldName: 'returnValue', type: 'text', initialWidth: 130 },
    { label: 'Endpoint', fieldName: 'endpoint', type: 'text' }
];

const METHOD_ANNOTATION = '@http';
const CLASS_ANNOTATION = '@restresource';

export default class RestDocumentation extends LightningElement {
    @api selectedApexClass;
    columns = columns;
    methodInfo = [];
    jsonSuccessContent = JSON.stringify({ foo: 'sample', bar: 'sample' }, null, 4);

    @api handleRowUnselection(){
        console.log('PAKAL: unselecting data table');
        //Literally couldn't find any other way to deselect all rows
        this.template.querySelector('lightning-datatable').maxRowSelection=0;
        this.template.querySelector('lightning-datatable').maxRowSelection=1;
 
        
    }

    get selectedClassData() {
        let tempDataArray = [];
        if (this.selectedApexClass) {
            const allLines = this.selectedApexClass.body.split('\n');
            let classEndpoint;
            allLines.forEach((line) => {
                let methodType, methodDefinition, methodReturnVal;

                if (line.includes(CLASS_ANNOTATION)) {
                    classEndpoint = this.findEndpointInLine(line);
                }
                if (line.includes(METHOD_ANNOTATION)) {
                    methodType = line.substring(line.indexOf(METHOD_ANNOTATION) + 5, line[-1]);
                    methodDefinition = allLines[allLines.indexOf(line) + 1];
                    methodReturnVal = this.findReturnValInMethodDef(methodDefinition);
                }

                if (classEndpoint && methodType) {
                    tempDataArray.push({
                        type: methodType.toUpperCase(),
                        methodDef: methodDefinition,
                        returnValue: methodReturnVal,
                        endpoint: 'services/apexrest' + classEndpoint
                    });
                }
            });
            return tempDataArray;
        }

        return [];
    }

    getSelectedRow(e) {
        this.methodInfo = e.detail.selectedRows[0];
        if (this.methodInfo) {
            const selectedRowEvent = new CustomEvent('selectedrow', {
                detail: {
                    type: this.methodInfo.type,
                    returnValue: this.methodInfo.returnValue,
                    endpoint: this.methodInfo.endpoint
                }
            });
            this.dispatchEvent(selectedRowEvent);
        }
    }

    findEndpointInLine(currentLine) {
        const n = currentLine.lastIndexOf('=') + 2;
        let classEndpoint = currentLine.slice(n, -4);
        classEndpoint = classEndpoint.replace(classEndpoint[1], classEndpoint[1].toUpperCase());
        return classEndpoint;
    }

    findReturnValInMethodDef(methodDef) {
        let methodReturnVal = methodDef.substring(methodDef.indexOf('static') + 7, methodDef.indexOf('('));
        methodReturnVal = methodReturnVal.split(' ');
        methodReturnVal.pop();
        methodReturnVal = methodReturnVal.join().trim();
        return methodReturnVal;
    }
}
