import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { FramerComponent } from './framer/framer.component'

const routes: Routes = [
  { path: 'window-frame', component: FramerComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
