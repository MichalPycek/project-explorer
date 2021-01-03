@isTest(isParallel=true)
public class RestExplorerControllerTest {
    @isTest
    private static void shouldGetAllApexClasses() {
        System.assertNotEquals(0,  RestExplorerController.getAllApexClasses().size());
    }
}
