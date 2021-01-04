public with sharing class RestExplorerController {

    @AuraEnabled(cacheable=true)
        public static List<ApexClass> getAllApexClasses(String filterVal){
        String searchParam = '%' + filterVal + '%';
        try {
            if(!String.isBlank(filterVal) || filterVal !=''){           
                return [
                SELECT Id, Name, Body 
                FROM ApexClass
                WHERE Name 
                LIKE :searchParam
                ];
            } else {
                return [SELECT Id, Name, Body FROM ApexClass];
                
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
