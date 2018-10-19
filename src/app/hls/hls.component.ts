import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { combineLatest, Subject } from 'rxjs'
import { debounceTime, startWith, map, tap, distinctUntilChanged } from 'rxjs/operators'

interface VideoInfo {
  readonly src: string
  readonly showControls: boolean
}

@Component({
  selector: 'app-hls',
  templateUrl: './hls.component.html',
  styleUrls: ['./hls.component.scss']
})
export class HlsComponent implements OnDestroy {
  public readonly formGroup = new FormGroup({
    dropdown: new FormControl('https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'),
    input: new FormControl(undefined),
    showControls: new FormControl(true),
    autoplay: new FormControl(true),
    poster: new FormControl('')
  })

  private readonly _hlsUrlSource$ = new Subject<VideoInfo>()
  private readonly _dropdownSubscription = this.formGroup.controls.dropdown.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(src => this._hlsUrlSource$.next(src))
  private readonly _dinputSubscription = this.formGroup.controls.input.valueChanges
    .pipe(distinctUntilChanged(), debounceTime(400))
    .subscribe(src => this._hlsUrlSource$.next(src))

  public readonly hls$ = this._hlsUrlSource$.asObservable().pipe(startWith('https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'))


  // readonly sub = combineLatest(
  //   this.formGroup.controls.dropdown.valueChanges.pipe(startWith('https://www.streambox.fr/playlists/x31e0e7/x31e0e7.m3u8')),
  //   this.formGroup.controls.input.valueChanges.pipe(debounceTime(500), startWith(undefined))
  // )
  // .pipe(
  //   map(a => {
  //     return {
  //       dropdon: a[0],
  //       input: a[1]
  //     }
  //   })
  // )
  // .subscribe(console.log)

  ngOnDestroy() {
    this._dropdownSubscription.unsubscribe()
    this._dinputSubscription.unsubscribe()
  }
}
