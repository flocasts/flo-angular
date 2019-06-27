import { NgModule } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { MarkdownModule } from 'ngx-markdown'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-env-transfer-state/browser'
import { FloWindowModule } from '@flosportsinc/ng-window'
import { FloVideoAutoplayModule } from '@flosportsinc/ng-video-autoplay'

@NgModule({
  imports: [
    FloVideoAutoplayModule,
    FloWindowModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule,
    NodeEnvTransferBrowserModule,
    MarkdownModule.forRoot({
      loader: HttpClient
    })
  ],
  exports: [
    FloVideoAutoplayModule,
    FloWindowModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule,
    MarkdownModule
  ]
})
export class SharedTestingModule { }
