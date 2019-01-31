import { NgModule } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { MarkdownModule } from 'ngx-markdown'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { NodeEnvTransferBrowserModule } from '@flosportsinc/ng-universal-services/node-env-transfer/browser'
import { WindowModule } from '@flosportsinc/ng-window'

@NgModule({
  imports: [
    WindowModule,
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
    WindowModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule,
    MarkdownModule
  ]
})
export class SharedTestingModule { }
