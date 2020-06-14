import { __decorate } from "tslib";
import { Output, Injectable, EventEmitter } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';
let ScreenService = class ScreenService {
    constructor(breakpointObserver) {
        this.breakpointObserver = breakpointObserver;
        this.changed = new EventEmitter();
        this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
            .subscribe(() => this.changed.next());
    }
    isLargeScreen() {
        const isLarge = this.breakpointObserver.isMatched(Breakpoints.Large);
        const isXLarge = this.breakpointObserver.isMatched(Breakpoints.XLarge);
        return isLarge || isXLarge;
    }
    get sizes() {
        return {
            'screen-x-small': this.breakpointObserver.isMatched(Breakpoints.XSmall),
            'screen-small': this.breakpointObserver.isMatched(Breakpoints.Small),
            'screen-medium': this.breakpointObserver.isMatched(Breakpoints.Medium),
            'screen-large': this.isLargeScreen(),
        };
    }
};
__decorate([
    Output()
], ScreenService.prototype, "changed", void 0);
ScreenService = __decorate([
    Injectable()
], ScreenService);
export { ScreenService };
//# sourceMappingURL=screen.service.js.map