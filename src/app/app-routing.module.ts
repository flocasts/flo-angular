import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FramerComponent } from './framer/framer.component'
import { HomeComponent } from './home/home.component'
import { HlsComponent } from './hls/hls.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hls', component: HlsComponent },
  { path: 'viewport-grid', component: FramerComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
