import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogSummaryPageRoutingModule } from './log-summary-routing.module';

import { LogSummaryPage } from './log-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogSummaryPageRoutingModule
  ],
  declarations: [LogSummaryPage]
})
export class LogSummaryPageModule {}
