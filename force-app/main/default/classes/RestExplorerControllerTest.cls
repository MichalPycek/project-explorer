@isTest
private class RestExplorerControllerTest {
    @isTest
    static void testGettingAllApexClasses() {
        String filterVal = '';
        List<ApexClass> actualClasses = new List<ApexClass>();
        actualClasses = RestExplorerController.getAllApexClasses(filterVal);
        List<ApexClass> expectedClasses = [SELECT Id FROM ApexClass WHERE Name LIKE '%'];
        System.assertEquals(
            expectedClasses.size(),
            actualClasses.size(),
            'Lists of Apex Classes should have same length.'
        );
    }

    @isTest
    static void testGettingFilteredApexClasses() {
        String filterVal = 'Acc';
        List<ApexClass> actualClasses = new List<ApexClass>();
        actualClasses = RestExplorerController.getAllApexClasses(filterVal);
        List<ApexClass> expectedClasses = [SELECT Id FROM ApexClass WHERE Name LIKE '%Acc%'];
        System.assertEquals(
            expectedClasses.size(),
            actualClasses.size(),
            'Lists of Apex Classes should have same length.'
        );
    }
}
