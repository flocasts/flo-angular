import { NgModule } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { MarkdownModule } from 'ngx-markdown'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClient, HttpClientModule } from '@angular/common/http'

@NgModule({
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule,
    MarkdownModule.forRoot({
      loader: HttpClient
    })
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule,
    MarkdownModule
  ]
})
export class SharedTestingModule { }
