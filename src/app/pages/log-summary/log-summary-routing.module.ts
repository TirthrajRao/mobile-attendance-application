import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogSummaryPage } from './log-summary.page';

const routes: Routes = [
  {
    path: '',
    component: LogSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogSummaryPageRoutingModule {}
