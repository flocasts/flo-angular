import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-lazy-load-readme',
  templateUrl: './lazy-load-readme.component.html',
  styleUrls: ['./lazy-load-readme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyLoadReadmeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
