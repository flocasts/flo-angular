import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FramerComponent } from './framer/framer.component'
import { WindowFrameModule } from '@flosportsinc/window-frame'
import { HomeComponent } from './home/home.component'

@NgModule({
  declarations: [
    AppComponent,
    FramerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WindowFrameModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
