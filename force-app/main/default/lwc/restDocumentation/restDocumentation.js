import { LightningElement, api } from 'lwc';

const columns = [
    { label: 'Method Type', fieldName: 'type', type: 'text', initialWidth: 100 },
    { label: 'Return', fieldName: 'returnValue', type: 'text', initialWidth: 100 },
    { label: 'Parameters', fieldName: 'params', type: 'text', initialWidth: 150 },
    { label: 'Endpoint', fieldName: 'endpoint', type: 'text', initialWidth: 150 }
];

const METHOD_ANNOTATION = '@http';
const CLASS_ANNOTATION = '@restresource';

export default class RestDocumentation extends LightningElement {
    @api selectedApexClass;
    columns = columns;
    methodInfo;

    getSelectedRow(e) {
        this.methodInfo = e.detail.selectedRows[0];
    }

    get selectedClassData() {
        let tempDataArray = [];
        if (this.selectedApexClass) {
            const allLines = this.selectedApexClass.body.split('\n');
            let classEndpoint;
            allLines.forEach((line) => {
                let methodType, methodDefinition, methodReturnVal, methodParams;

                if (line.includes(CLASS_ANNOTATION)) {
                    classEndpoint = this.findEndpointInLine(line);
                }
                if (line.includes(METHOD_ANNOTATION)) {
                    methodType = line.substring(line.indexOf(METHOD_ANNOTATION) + 5, line[-1]);
                    methodDefinition = allLines[allLines.indexOf(line) + 1];
                    methodReturnVal = this.findReturnValInMethodDef(methodDefinition);
                    methodParams = this.findParamsInMethodDef(methodDefinition);
                }

                if (classEndpoint && methodType) {
                    tempDataArray.push({
                        type: methodType.toUpperCase(),
                        methodDef: methodDefinition,
                        returnValue: methodReturnVal,
                        params: methodParams,
                        endpoint: classEndpoint
                    });
                }
            });
            return tempDataArray;
        }
        return [];
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

    findParamsInMethodDef(methodDef) {
        let methodParams = methodDef.substring(methodDef.indexOf('(') + 1, methodDef.indexOf(')'));
        if (methodParams === ' ' || methodParams == null || methodParams === '') {
            methodParams = 'No Input Parameters';
        }
        return methodParams;
    }
}
