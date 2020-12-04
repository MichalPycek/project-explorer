public with sharing class RestExplorerController {

    @AuraEnabled(cacheable=true)
    public static List<ApexClass> getAllApexClasses(){
        try {
            return [SELECT Id, Name, Body FROM ApexClass];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
