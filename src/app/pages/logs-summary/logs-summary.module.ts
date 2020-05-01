import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { LogsSummaryPageRoutingModule } from './logs-summary-routing.module';
import { DatepickerModule,   BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LogsSummaryPage } from './logs-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsSummaryPageRoutingModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot() ,
  ],
  declarations: [LogsSummaryPage]
})
export class LogsSummaryPageModule {}
