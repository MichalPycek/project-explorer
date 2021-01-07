@isTest
public with sharing class RestCalloutBuilderTest {
    @isTest
    static void testMakeRestCalloutWithBody() {
        String endpoint = 'testEndpoint';
        String type = 'POST';
        String returnVal = 'Account';
        String body = 'Test body';

        HttpRequest request = new HttpRequest();
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        Test.setMock(HttpCalloutMock.class, new BuilderHttpCalloutMock());
        HttpResponse response = BuilderHttpCalloutMock.respond(request);
        Map<String, String> responseValues = new Map<String, String>();
        Boolean isException = false;
        String eMessage;

        Test.startTest();
        try {
            responseValues = RestCalloutBuilder.makeRestCallout(endpoint, type, returnVal, body);
        } catch (DmlException e) {
            isException = true;
            eMessage = e.getMessage();
        }
        Test.stopTest();

        Map<String, String> expectedResponseValues = new Map<String, String>();
        expectedResponseValues.put('body', 'Test');
        expectedResponseValues.put('statusCode', '200');

        System.assertEquals(
            expectedResponseValues.get('body'),
            responseValues.get('body'),
            'Body of the response should be the same'
        );
        System.assertEquals(
            expectedResponseValues.get('statusCode'),
            responseValues.get('statusCode'),
            'Status code of the response should be the same'
        );
    }

    @isTest
    static void testMakeRestCalloutWithoutBody() {
        String endpoint = 'testEndpoint';
        String type = 'GET';
        String returnVal = 'Account';
        String body = null;

        HttpRequest request = new HttpRequest();
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        Test.setMock(HttpCalloutMock.class, new BuilderHttpCalloutMock());
        HttpResponse response = BuilderHttpCalloutMock.respond(request);
        Map<String, String> responseValues = new Map<String, String>();
        Boolean isException = false;
        String eMessage;

        Test.startTest();
        try {
            responseValues = RestCalloutBuilder.makeRestCallout(endpoint, type, returnVal, body);
        } catch (DmlException e) {
            isException = true;
            eMessage = e.getMessage();
        }
        Test.stopTest();

        Map<String, String> expectedResponseValues = new Map<String, String>();
        expectedResponseValues.put('body', 'Test');
        expectedResponseValues.put('statusCode', '200');

        System.assertEquals(
            expectedResponseValues.get('body'),
            responseValues.get('body'),
            'Body of the response should be the same'
        );
        System.assertEquals(
            expectedResponseValues.get('statusCode'),
            responseValues.get('statusCode'),
            'Status code of the response should be the same'
        );
    }
}