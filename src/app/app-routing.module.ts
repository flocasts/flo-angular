import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { HlsComponent } from './hls/hls.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { UniversalServicesComponent } from './universal-services/universal-services.component'
import { HlsDemoComponent } from './hls/hls-demo/hls-demo.component'
import { HlsReadmeComponent } from './hls/hls-readme/hls-readme.component'
import { HlsApiComponent } from './hls/hls-api/hls-api.component'
import { IconsComponent } from './icons/icons.component'
import { StylesComponent } from './styles/styles.component'
import { AutoplayComponent } from './autoplay/autoplay.component'
import { GridListComponent } from './grid-list/grid-list.component'
import { FullscreenComponent } from './fullscreen/fullscreen.component'
import { FetchFillComponent } from './fetch-fill/fetch-fill.component'
import {LazyLoadComponent} from './lazy-load/lazy-load/lazy-load.component'

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
  { path: 'universal-services', component: UniversalServicesComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'styles', component: StylesComponent },
  { path: 'autoplay', component: AutoplayComponent },
  { path: 'grid-list', component: GridListComponent },
  { path: 'fullscreen', component: FullscreenComponent },
  { path: 'lazy-load', component: LazyLoadComponent },
  { path: 'projects/flosportsinc/ng-fetch-fill/demo', component: FetchFillComponent },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
