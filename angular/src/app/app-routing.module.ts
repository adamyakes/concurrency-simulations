import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoundedBufferComponent } from './bounded-buffer/bounded-buffer.component';
import { DpComponent } from './dp/dp.component';
import { ReadwriteComponent } from './readwrite/readwrite.component';
import { SolutionPageComponent } from './solution-page/solution-page.component';
import { UnisexComponent } from './unisex/unisex.component';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'problem',
    component: SolutionPageComponent,
    children: [
      { path: 'dp', component: DpComponent, data: { title: 'Dining Philosophers'} },
      { path: 'readwrite', component: ReadwriteComponent, data: { title: 'Readers and Writers' } },
      { path: 'boundedbuffer', component: BoundedBufferComponent, data: { title: 'Bounded Buffer' } },
      { path: 'unisex', component: UnisexComponent, data: { title: 'Unisex Bathroom ' }, },
      { path: '', redirectTo: '/dp', pathMatch: 'full' },
      { path: '**', redirectTo: '/dp' },
    ]
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
