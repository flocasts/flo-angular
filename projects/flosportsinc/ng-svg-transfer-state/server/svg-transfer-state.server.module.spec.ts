// import { TestBed } from '@angular/core/testing'
// import { SVG_REQUEST_PATTERN_BASE } from './svg-transfer-state.tokens'
// import { HttpClientTestingModule } from '@angular/common/http/testing'
// import { SvgTransferStateServerModule } from './svg-transfer-state.server.module'

// const setupTb = (config?: string) => {
//   TestBed.configureTestingModule({
//     providers: [
//     ],
//     imports: [
//       HttpClientTestingModule,
//       SvgTransferStateServerModule.withSvgAssetRoot(config)
//     ]
//   })
// }

// describe(SvgTransferStateServerModule.name, () => {
//   afterEach(() => TestBed.resetTestingModule())

//   it('should setup with default values', () => {
//     setupTb()

//     const patternBase = TestBed.get(SVG_REQUEST_PATTERN_BASE)
//     // expect(patternBase).toEqual(DEFAULT_CONFIG.dir)
//   })

//   it('should default to a directory if config value is undefined', () => {
//     setupTb('some-path')

//     // const patternBase = TestBed.get(SVG_REQUEST_PATTERN_BASE)
//     // expect(patternBase).toEqual(DEFAULT_CONFIG.dir)
//   })

//   it('should default to a directory if config value is undefined', () => {
//     setupTb(undefined)

//     // const patternBase = TestBed.get(SVG_REQUEST_PATTERN_BASE)
//     // expect(patternBase).toEqual(DEFAULT_CONFIG.dir)
//   })
// })
