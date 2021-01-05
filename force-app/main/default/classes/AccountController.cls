public with sharing class AccountController {
    public Account getAccountName(Id accountId) {
        return [SELECT Name FROM Account WHERE Id = :accountId];
    }
}