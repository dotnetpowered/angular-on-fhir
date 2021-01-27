import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LaunchComponent } from './launch/launch.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext'
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {InputNumberModule} from 'primeng/inputnumber';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {AvatarModule} from 'primeng/avatar';

import { Globals } from './shared/globals';

@NgModule({
  declarations: [
    AppComponent,
    LaunchComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    BrowserAnimationsModule,
    CalendarModule,
    DialogModule,
    FormsModule,
    CheckboxModule,
    AvatarModule,
    HttpClientModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
