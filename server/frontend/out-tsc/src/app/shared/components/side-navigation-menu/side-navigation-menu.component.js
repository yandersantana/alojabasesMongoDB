import { __decorate } from "tslib";
import { Component, NgModule, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { DxTreeViewModule, DxTreeViewComponent } from 'devextreme-angular/ui/tree-view';
import * as events from 'devextreme/events';
let SideNavigationMenuComponent = class SideNavigationMenuComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.selectedItemChanged = new EventEmitter();
        this.openMenu = new EventEmitter();
        this._compactMode = false;
    }
    set selectedItem(value) {
        if (this.menu.instance) {
            this.menu.instance.selectItem(value);
        }
    }
    get compactMode() {
        return this._compactMode;
    }
    set compactMode(val) {
        this._compactMode = val;
        if (val && this.menu.instance) {
            this.menu.instance.collapseAll();
        }
    }
    updateSelection(event) {
        const nodeClass = 'dx-treeview-node';
        const selectedClass = 'dx-state-selected';
        const leafNodeClass = 'dx-treeview-node-is-leaf';
        const element = event.element;
        const rootNodes = element.querySelectorAll(`.${nodeClass}:not(.${leafNodeClass})`);
        Array.from(rootNodes).forEach(node => {
            node.classList.remove(selectedClass);
        });
        let selectedNode = element.querySelector(`.${nodeClass}.${selectedClass}`);
        while (selectedNode && selectedNode.parentElement) {
            if (selectedNode.classList.contains(nodeClass)) {
                selectedNode.classList.add(selectedClass);
            }
            selectedNode = selectedNode.parentElement;
        }
    }
    onItemClick(event) {
        this.selectedItemChanged.emit(event);
    }
    onMenuInitialized(event) {
        event.component.option('deferRendering', false);
    }
    ngAfterViewInit() {
        events.on(this.elementRef.nativeElement, 'dxclick', (e) => {
            this.openMenu.next(e);
        });
    }
    ngOnDestroy() {
        events.off(this.elementRef.nativeElement, 'dxclick');
    }
};
__decorate([
    ViewChild(DxTreeViewComponent, { static: true })
], SideNavigationMenuComponent.prototype, "menu", void 0);
__decorate([
    Output()
], SideNavigationMenuComponent.prototype, "selectedItemChanged", void 0);
__decorate([
    Output()
], SideNavigationMenuComponent.prototype, "openMenu", void 0);
__decorate([
    Input()
], SideNavigationMenuComponent.prototype, "items", void 0);
__decorate([
    Input()
], SideNavigationMenuComponent.prototype, "selectedItem", null);
__decorate([
    Input()
], SideNavigationMenuComponent.prototype, "compactMode", null);
SideNavigationMenuComponent = __decorate([
    Component({
        selector: 'app-side-navigation-menu',
        templateUrl: './side-navigation-menu.component.html',
        styleUrls: ['./side-navigation-menu.component.scss']
    })
], SideNavigationMenuComponent);
export { SideNavigationMenuComponent };
let SideNavigationMenuModule = class SideNavigationMenuModule {
};
SideNavigationMenuModule = __decorate([
    NgModule({
        imports: [DxTreeViewModule],
        declarations: [SideNavigationMenuComponent],
        exports: [SideNavigationMenuComponent]
    })
], SideNavigationMenuModule);
export { SideNavigationMenuModule };
//# sourceMappingURL=side-navigation-menu.component.js.map