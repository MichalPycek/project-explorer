@isTest(isParallel=true)
public class RestExplorerControllerTest {
    @isTest
    static void shouldGetAllApexClasses() {
        System.assertNotEquals(0,  RestExplorerController.getAllApexClasses().size());
    }
}