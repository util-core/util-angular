import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { environment } from "environment";

@Component({
    selector: 'app-welcome',
    templateUrl: environment.production ? './html/welcome.component.html' : 'view/Welcome/Welcome'
})
export class WelcomeComponent {
}
