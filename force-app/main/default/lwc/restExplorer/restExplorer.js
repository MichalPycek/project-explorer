import { LightningElement, wire } from "lwc";
import getAllApexClasses from "@salesforce/apex/RestExplorerController.getAllApexClasses";
const columns = [{ label: "Method", fieldName: "method", type: "text" }];

export default class RestExplorer extends LightningElement {
  _selected = [];

  error;
  columns = columns;
  data = [];
  options = [];

  @wire(getAllApexClasses)
  apexClasses({ error, data }) {
    if (data) {
      this.options = data
        .filter((apexClass) => apexClass.Body.includes("@RestResource"))
        .map((apexClass) => {
          return {
            label: apexClass.Name,
            value: apexClass.Id
          };
        });
    } else if (error) {
      this.error = error;
    }
  }

  handleChange(e) {
    this._selected = e.detail.value;
  }
}
