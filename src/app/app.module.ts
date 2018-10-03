import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FramerComponent, AppSimpleTestDirective } from './framer/framer.component'
import { ViewportGridModule } from '@flosportsinc/viewport-grid'
import { HomeComponent } from './home/home.component'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent,
    AppSimpleTestDirective
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    ViewportGridModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
