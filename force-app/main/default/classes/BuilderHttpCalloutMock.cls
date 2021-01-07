@isTest
global class BuilderHttpCalloutMock implements HttpCalloutMock {
    global static HttpResponse respond(HttpRequest request) {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('Test');
        response.setStatusCode(200);
        return response;
    }
}