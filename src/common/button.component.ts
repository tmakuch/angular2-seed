import { Component, Input } from '@angular/core';

@Component({
    selector: 'my-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.less']
})

export class ButtonComponent {
    @Input() public content: string;
}