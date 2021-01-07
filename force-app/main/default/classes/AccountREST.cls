@RestResource(urlMapping='/Account/*')
global with sharing class AccountREST {
    @HttpGet
    global static Account getAccount() {
        Id accountId = RestContext.request.params.get('accountId');
        AccountController controller = new AccountController();
        return controller.getAccountName(accountId);
    }

    @HttpPost
    global static Id createAccount() {
        Account acc = (Account) JSON.deserialize(RestContext.request.requestBody.toString(), Account.class);
        insert acc;
        return acc.Id;
    }

    @HttpPut
    global static Id upsertAccount() {
        Account acc = (Account) JSON.deserialize(RestContext.request.requestBody.toString(), Account.class);
        upsert acc;
        return acc.Id;
    }

    @HttpPatch
    global static Id updateAccount() {
        Account acc = (Account) JSON.deserialize(RestContext.request.requestBody.toString(), Account.class);
        update acc;
        return acc.Id;
    }

    @HttpDelete
    global static void deleteAccount() {
        Id accountId = RestContext.request.params.get('accountId');
        AccountController controller = new AccountController();
        delete controller.getAccountName(accountId);
    }
}