import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FramerComponent } from './viewport-grid/viewport-grid.component'
import { HomeComponent } from './home/home.component'
import { HlsComponent } from './hls/hls.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { UniversalServicesComponent } from './universal-services/universal-services.component'
import { HlsDemoComponent } from './hls/hls-demo/hls-demo.component'
import { HlsReadmeComponent } from './hls/hls-readme/hls-readme.component'
import { HlsApiComponent } from './hls/hls-api/hls-api.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'hls',
    component: HlsComponent,
    children: [
      { path: '', component: HlsReadmeComponent },
      { path: 'demo', component: HlsDemoComponent },
      { path: 'api', component: HlsApiComponent }
    ]
  },
  { path: 'viewport-grid', component: FramerComponent },
  { path: 'universal-services', component: UniversalServicesComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
