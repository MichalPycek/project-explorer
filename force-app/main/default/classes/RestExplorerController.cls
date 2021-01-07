public with sharing class RestExplorerController {

    @AuraEnabled(cacheable=true)
        public static List<ApexClass> getAllApexClasses(String filterVal){
        String searchParam = '%' + filterVal + '%';
        
        if(String.isBlank(filterVal)){           
            return [SELECT Id, Name, Body FROM ApexClass];
        } else { 
            return [
                SELECT Id, Name, Body 
                FROM ApexClass
                WHERE Name 
                LIKE :searchParam
                ];
            
        }
        }
    }
