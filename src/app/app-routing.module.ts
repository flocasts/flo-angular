import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FramerComponent } from './viewport-grid/viewport-grid.component'
import { HomeComponent } from './home/home.component'
import { HlsComponent } from './hls/hls.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { UniversalServicesComponent } from './universal-services/universal-services.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hls', component: HlsComponent },
  { path: 'viewport-grid', component: FramerComponent },
  { path: 'universal-services', component: UniversalServicesComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
