import { Component, OnDestroy } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { startWith } from 'rxjs/operators'

const DEFAULT_SRC = 'https://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8'

@Component({
  selector: 'app-hls',
  templateUrl: './hls.component.html',
  styleUrls: ['./hls.component.scss']
})
export class HlsComponent implements OnDestroy {
  public readonly dropdown = new FormControl(DEFAULT_SRC)
  public readonly formGroup = new FormGroup({
    src: new FormControl(DEFAULT_SRC),
    controls: new FormControl(true),
    autoplay: new FormControl(true),
    playsinline: new FormControl(true),
    poster: new FormControl(undefined)
  })

  public readonly config$ = this.formGroup.valueChanges
    .pipe(startWith(this.formGroup.value))

  private readonly _dropdownSubscription = this.dropdown.valueChanges
    .pipe(startWith(DEFAULT_SRC))
    .subscribe(val => this.formGroup.controls.src.setValue(val))

  ngOnDestroy() {
    this._dropdownSubscription.unsubscribe()
  }
}