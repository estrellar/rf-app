import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataPagePage } from './data-page.page';

const routes: Routes = [
  {
    path: '',
    component: DataPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataPagePageRoutingModule {}
