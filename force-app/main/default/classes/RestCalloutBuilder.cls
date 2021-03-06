public with sharing class RestCalloutBuilder {
    @AuraEnabled(cacheable=true)
    public static Map<String, String> makeRestCallout(String endpoint, String type, String returnVal, String body) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        HttpResponse response = new HttpResponse();
        String sfdcBaseURL = 'callout:workbenchNE/' + endpoint;
        request.setEndpoint(sfdcBaseURL);
        request.setMethod(type.trim());
        if (type == 'PUT' || type == 'POST' || type == 'PATCH') {
            request.setBody(body);
        }
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        Map<String, String> responseValues = new Map<String, String>();

        try {
            response = http.send(request);
            responseValues.put('body', response.getBody());
            responseValues.put('statusCode', string.valueOf(response.getStatusCode()));
            return responseValues;
        } catch (Exception e) {
            responseValues.put('body', response.getBody());
            responseValues.put('statusCode', e + ' ' + string.valueOf(response.getStatusCode()));
            return responseValues;
        }
    }
}
