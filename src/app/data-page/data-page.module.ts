import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPagePageRoutingModule } from './data-page-routing.module';

import { DataPagePage } from './data-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPagePageRoutingModule
  ],
  declarations: [DataPagePage]
})
export class DataPagePageModule {}
