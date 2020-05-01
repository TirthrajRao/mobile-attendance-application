import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogsSummaryPage } from './logs-summary.page';

const routes: Routes = [
  {
    path: '',
    component: LogsSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogsSummaryPageRoutingModule {}
