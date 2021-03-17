import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DpComponent } from './dp/dp.component';
import { DpStatsComponent } from './dp-stats/dp-stats.component';
import { ReadwriteComponent, ReadWriteStateStringPipe } from './readwrite/readwrite.component';
import { BoundedBufferComponent } from './bounded-buffer/bounded-buffer.component';
import { ModusStateStringPipe } from './pipes/modus-state-string.pipe';
import { BoundedStateStringPipe } from './pipes/bounded-state-string.pipe';
import { NanoTimePipe } from './pipes/nano-time.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './wrappers/slider/slider.component';

import {MatCardModule} from '@angular/material/card';
import { MatDialogModule  } from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SolutionPageComponent } from './solution-page/solution-page.component';
import { ReadwritePastRunsComponent } from './readwrite-past-runs/readwrite-past-runs.component';
import { NanoDurationPipe } from './pipes/nano-duration.pipe';
import { BufferPastRunsComponent } from './buffer-past-runs/buffer-past-runs.component';
import { UnisexComponent } from './unisex/unisex.component';
import { UnisexPastRunsComponent } from './unisex-past-runs/unisex-past-runs.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DpComponent,
    DpStatsComponent,
    ReadwriteComponent,
    ReadWriteStateStringPipe,
    BoundedBufferComponent,
    ModusStateStringPipe,
    BoundedStateStringPipe,
    NanoTimePipe,
    SliderComponent,
    SolutionPageComponent,
    ReadwritePastRunsComponent,
    NanoDurationPipe,
    BufferPastRunsComponent,
    UnisexComponent,
    UnisexPastRunsComponent,
    WelcomeComponent,
    AuthDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatDialogModule,
    MatInputModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
  ],
  providers: [
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
