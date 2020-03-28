import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [
	CommonModule,
	FormsModule,
	IonicModule,
	HttpClientModule,
	LoginPageRoutingModule,
	ReactiveFormsModule
	],
	declarations: [LoginPage],
	bootstrap: [LoginPage]
})
export class LoginPageModule {}
