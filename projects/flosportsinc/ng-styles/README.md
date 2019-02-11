# FloSports StyleSheets
The FloSports web styles

## CSS Installation

```html
<head>
  <!-- Latest Version (requires a redirect) -->
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/@flosportsinc/ng-styles/css/flo.min.css">

  <!-- Pinned Version -->
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/@flosportsinc/ng-styles@X.X.X/css/flo.min.css">
</head>
```

## SASS Installation
```scss
/* Your project's SCSS file */
@import 'node_modules/@flosportsinc/ng-styles/scss/main.scss';
```

## Angular CLI Installation
```json
// angular.json
{
  ...,
   "styles": [
     "src/styles.scss",
     "node_modules/@flosportsinc/ng-styles/scss/main.scss"
  ]
  ...
}
```