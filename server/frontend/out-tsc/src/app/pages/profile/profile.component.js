import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ProfileComponent = class ProfileComponent {
    constructor() {
        this.employee = {
            ID: 7,
            FirstName: 'Sandra',
            LastName: 'Johnson',
            Prefix: 'Mrs.',
            Position: 'Controller',
            Picture: 'images/employees/06.png',
            BirthDate: new Date('1974/11/15'),
            HireDate: new Date('2005/05/11'),
            /* tslint:disable-next-line:max-line-length */
            Notes: 'Sandra is a CPA and has been our controller since 2008. She loves to interact with staff so if you`ve not met her, be certain to say hi.\r\n\r\nSandra has 2 daughters both of whom are accomplished gymnasts.',
            Address: '4600 N Virginia Rd.'
        };
        this.colCountByScreen = {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4
        };
    }
};
ProfileComponent = __decorate([
    Component({
        templateUrl: 'profile.component.html',
        styleUrls: ['./profile.component.scss']
    })
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map