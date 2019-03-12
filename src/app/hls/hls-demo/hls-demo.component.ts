import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { startWith } from 'rxjs/operators'

const DEFAULT_SRC = 'https://cdn-flo.flodogs.com/uploaded/mzEp5zBJ943XvZXba7DnVmvD2zZPqJk6/playlist.m3u8'

@Component({
  selector: 'app-hls-demo',
  templateUrl: './hls-demo.component.html',
  styleUrls: ['./hls-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HlsDemoComponent implements OnDestroy {
  public readonly dropdown = new FormControl(DEFAULT_SRC)
  public readonly formGroup = new FormGroup({
    src: new FormControl(DEFAULT_SRC),
    controls: new FormControl(true),
    autoplay: new FormControl(true),
    playsinline: new FormControl(true)
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
