// import { Component, NgModule } from 'projects/flosportsinc/ng-video-player/controls/vpc-volume/node_modules/@angular/core'
// import { FloVideoPlayerControlsPauseModule } from './vpc-pause.module'
// import { TestBed } from 'projects/flosportsinc/ng-video-player/controls/vpc-volume/node_modules/@angular/core/testing'
// import { By } from 'projects/flosportsinc/ng-video-player/controls/vpc-volume/node_modules/@angular/platform-browser'
// import { CommonModule } from 'projects/flosportsinc/ng-video-player/controls/vpc-volume/node_modules/@angular/common'
// import { FloVideoPlayerPauseControlDirective } from './vpc-pause.directive'

// // tslint:disable: readonly-keyword
// // tslint:disable: no-object-mutation

// @Component({
//   selector: 'flo-test-component',
//   template: `<video #videoRef></video><button [floVpc]="videoRef" [floVpcMeta]="meta" floVpcPause>PLAY</button>`
// })
// export class FloTestComponent {
//   meta: { test: 123 }
// }

// @NgModule({
//   declarations: [FloTestComponent],
//   imports: [CommonModule, FloVideoPlayerControlsPauseModule]
// })
// export class TestModule { }

// const createsut = () => {
//   const fixture = TestBed.createComponent(FloTestComponent)
//   fixture.detectChanges()
//   const videoElement = fixture.debugElement.query(By.css('video')).nativeElement as HTMLVideoElement
//   const btnElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement
//   return {
//     fixture,
//     videoElement,
//     btnElement
//   }
// }

// describe(FloVideoPlayerPauseControlDirective.name, () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [TestModule]
//     }).compileComponents()
//   })

//   afterEach(() => {
//     TestBed.resetTestingModule()
//   })

//   it('should play video when clicked', () => {
//     const sut = createsut()
//     const spy = spyOn(sut.videoElement, 'pause').and.callThrough()
//     sut.btnElement.click()
//     expect(spy).toHaveBeenCalled()
//   })
// })
