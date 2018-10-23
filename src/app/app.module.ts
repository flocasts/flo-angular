import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FramerComponent } from './viewport-grid/viewport-grid.component'
import { ViewportGridModule } from '@flosportsinc/viewport-grid'
import { HlsJsModule } from '@flosportsinc/hls'
import { HomeComponent } from './home/home.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HlsComponent } from './hls/hls.component'

@NgModule({
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent,
    HlsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    ViewportGridModule,
    HlsJsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
