import { __decorate } from "tslib";
import { Component } from '@angular/core';
import 'devextreme/data/odata/store';
let DisplayDataComponent = class DisplayDataComponent {
    constructor() {
        this.dataSource = {
            store: {
                type: 'odata',
                key: 'Task_ID',
                url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
            },
            expand: 'ResponsibleEmployee',
            select: [
                'Task_ID',
                'Task_Subject',
                'Task_Start_Date',
                'Task_Due_Date',
                'Task_Status',
                'Task_Priority',
                'Task_Completion',
                'ResponsibleEmployee/Employee_Full_Name'
            ]
        };
        this.priority = [
            { name: 'High', value: 4 },
            { name: 'Urgent', value: 3 },
            { name: 'Normal', value: 2 },
            { name: 'Low', value: 1 }
        ];
    }
};
DisplayDataComponent = __decorate([
    Component({
        templateUrl: 'display-data.component.html'
    })
], DisplayDataComponent);
export { DisplayDataComponent };
//# sourceMappingURL=display-data.component.js.map