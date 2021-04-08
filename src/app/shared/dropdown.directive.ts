import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({ 
    selector: '[appDropdown]'
})
export class DropdownDirective {

    @HostBinding('class.open') isOpen = false;

    // Version of the exercise - requires clicking back on the same button
    
    // @HostListener('click') toggleOpen(eventData: Event) {
    //     this.isOpen = !this.isOpen;
    // }

    // as offered in video 8.2 (html warning)

    // If you want that a dropdown can also be closed by a click anywhere outside
    // (which also means that a click on one dropdown closes any other one, btw.),
    // replace the code of dropdown.directive.ts by this one (placing the listener
    //     not on the dropdown, but on the document):

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
      this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    }
    constructor(private elRef: ElementRef) {}
}
