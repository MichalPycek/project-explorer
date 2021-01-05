@isTest
private class AccountRESTTest {
    @TestSetup
    static void dataSetup() {
        Account testAcc = new Account(Name = 'Test');
        insert testAcc;
    }

    @isTest
    static void testGetAccount() {
        Account testAcc = [SELECT Id FROM Account LIMIT 1];
        RestRequest req = new RestRequest();
        req.addHeader('Content-Type', 'application/json');
        req.requestURI = '/services/apexrest/Account/';
        req.httpMethod = 'GET';
        req.params.put('accountId', testAcc.Id);
        RestContext.request = req;
        Account thisAccount = AccountREST.getAccount();
        System.assertEquals('Test', thisAccount.Name, 'Accounts should have the same name');
    }

    @isTest
    static void testCreateAccout() {
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/Account/';
        req.httpMethod = 'POST';
        req.addHeader('Content-Type', 'application/json');
        req.requestBody = Blob.valueOf('{"Name": "Test", "Description": "Testing"}');
        RestContext.request = req;
        Id accId = AccountREST.createAccount();
        Account acc = [SELECT Id, Name, Description FROM Account WHERE Id = :accId];
        System.assertEquals('Test', acc.Name, 'Account should have name');
        System.assertEquals('Testing', acc.Description, 'Account should have description');
    }

    @isTest
    static void testUpsertAccout() {
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/Account/';
        req.httpMethod = 'PUT';
        req.addHeader('Content-Type', 'application/json');
        req.requestBody = Blob.valueOf('{"Name": "Test Put Insertion"}');
        RestContext.request = req;
        Id accId = AccountREST.upsertAccount();
        Account insertedAcc = [SELECT Id, Name FROM Account WHERE Id = :accId];
        System.assertEquals('Test Put Insertion', insertedAcc.Name, 'Account should be correctly inserted');
        req.requestBody = Blob.valueOf('{"Id": "' + accId + '", "Name": "Test Put Update"}');
        RestContext.request = req;
        accId = AccountREST.upsertAccount();
        Account updatedAcc = [SELECT Id, Name FROM Account WHERE Id = :accId];
        System.assertEquals(insertedAcc.Id, updatedAcc.Id, 'Ids should be the same');
        System.assertEquals('Test Put Update', updatedAcc.Name, 'Account should be correctly updated');
    }

    @isTest
    static void testUpdateAccout() {
        Account testAcc = [SELECT Id FROM Account LIMIT 1];
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/Account/';
        req.httpMethod = 'PATCH';
        req.addHeader('Content-Type', 'application/json');
        req.requestBody = Blob.valueOf('{"Id": "' + testAcc.Id + '", "Name": "Test Patch"}');
        RestContext.request = req;
        Id accId = AccountREST.updateAccount();
        Account updatedAcc = [SELECT Id, Name, Description FROM Account WHERE Id = :accId];
        System.assertEquals('Test Patch', updatedAcc.Name, 'Account should have updated name');
    }

    @isTest
    static void testDeleteAccout() {
        Account testAcc = [SELECT Id FROM Account LIMIT 1];
        RestRequest req = new RestRequest();
        req.requestURI = '/services/apexrest/Account/';
        req.httpMethod = 'DELETE';
        req.addHeader('Content-Type', 'application/json');
        req.params.put('accountId', testAcc.Id);
        RestContext.request = req;
        AccountREST.deleteAccount();
        System.assertEquals(0, [SELECT COUNT() FROM Account], 'Account with ID ' + testAcc.Id + ' should be removed.');
    }
}
