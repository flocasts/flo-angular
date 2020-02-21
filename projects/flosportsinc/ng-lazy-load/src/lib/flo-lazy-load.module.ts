import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FloLazyLoadDirective} from './defer-load.directive';
@NgModule({
    imports: [CommonModule],
    declarations: [FloLazyLoadDirective],
    exports: [FloLazyLoadDirective]
})
export class FloLazyLoadModule { }
