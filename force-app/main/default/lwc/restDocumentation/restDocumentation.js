import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Method Type', fieldName: 'type', type: 'text', initialWidth: 100 },
    { label: 'Return', fieldName: 'returnValue', type: 'text', initialWidth: 80 },
    { label: 'Endpoint', fieldName: 'endpoint', type: 'text'}

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
            let classEndpoint, methodParams, checkMultipleLineParams,methodType, methodDefinition, methodReturnVal;
            allLines.forEach((line) => {
                if (line.includes(CLASS_ANNOTATION)) {
                    classEndpoint = this.findEndpointInLine(line);
                }
                if (line.includes(METHOD_ANNOTATION)) {
                    methodType = line.substring(line.indexOf(METHOD_ANNOTATION) + 5, line[-1]);
                    methodDefinition = allLines[allLines.indexOf(line) + 1];
                    methodReturnVal = this.findReturnValInMethodDef(methodDefinition);
                   
                    if(methodDefinition.indexOf(')') !== -1){
                        methodParams = this.findParamsInMethodDef(methodDefinition);
                        checkMultipleLineParams = false;
                    } else {
                        checkMultipleLineParams = true;
                    }
                }

                if(checkMultipleLineParams){
                    if(line.indexOf(')') !== -1){
                        checkMultipleLineParams = false;
                    }
                    methodParams = this.appendParamsFromLine(line, methodParams);
    
                }

                if (classEndpoint && methodType && checkMultipleLineParams==false) {
                    console.log('METHOD PARAMS', methodParams);
                    tempDataArray.push({
                        type: methodType.toUpperCase(),
                        methodDef: methodDefinition,
                        returnValue: methodReturnVal,
                        endpoint: 'services/apexrest' + classEndpoint,
                        methodParameters: methodParams
                    });
                    methodDefinition = undefined;
                    methodType = undefined;
                    methodParams = undefined;
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

    findParamsInMethodDef(methodDef){
        let methodParams = methodDef.substring(
            methodDef.indexOf('(') + 1,
            methodDef.indexOf(')')
        );
        if (methodParams === ' ' || methodParams == null || methodParams === '') {
            methodParams = 'No specified parameters';
        }
        return methodParams;
    }

    appendParamsFromLine(currentLine, currentParams){
        let updatedParams = '';
        if(currentParams === undefined){
            return updatedParams;
        } else {
            if(currentLine.indexOf('(') !== -1){
                updatedParams = currentLine.substring(
                    currentLine.indexOf('(') + 1,
                    currentLine.length
                );
            } else {
                if(currentLine.indexOf(')') !== -1){
                    updatedParams = currentLine.substring(0, currentLine.indexOf(')'));

                } else {
                    updatedParams = currentLine;
                }
            } 
        }

        return currentParams + updatedParams.trim();
    }

}