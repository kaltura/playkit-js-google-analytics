# PlayKit JS Google Analytics - Google Analytics plugin for the [Kaltura Player JS]

[![Build Status](https://github.com/kaltura/playkit-js-google-analytics/actions/workflows/run_canary_full_flow.yaml/badge.svg)](https://github.com/kaltura/playkit-js-google-analytics/actions/workflows/run_canary_full_flow.yaml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-google-analytics/latest.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-google-analytics)
[![](https://img.shields.io/npm/v/@playkit-js/playkit-js-google-analytics/canary.svg)](https://www.npmjs.com/package/@playkit-js/playkit-js-google-analytics/v/canary)

PlayKit JS Google Analytics plugin integrates google analytics with the [Kaltura Player JS].

PlayKit JS Google Analytics is written in [ECMAScript6], statically analysed using [Flow] and transpiled in ECMAScript5 using [Babel].

[flow]: https://flow.org/
[ecmascript6]: https://github.com/ericdouglas/ES6-Learning#articles--tutorials
[babel]: https://babeljs.io

## Getting Started

### Prerequisites

The plugin requires [Kaltura Player JS] to be loaded first.

[kaltura player js]: https://github.com/kaltura/kaltura-player-js

### Installing

First, clone and run [yarn] to install dependencies:

[yarn]: https://yarnpkg.com/lang/en/

```
git clone https://github.com/kaltura/playkit-js-google-analytics.git
cd playkit-js-google-analytics
yarn install
```

### Building

Then, build the player

```javascript
yarn run build
```

### Embed the library in your test page

Finally, add the bundle as a script tag in your page, and initialize the player

```html
<script type="text/javascript" src="/PATH/TO/FILE/kaltura-{ovp/tv}-player.js"></script>
<script type="text/javascript" src="/PATH/TO/FILE/playkit-google-analytics.js"></script>
<div id="player-placeholder" style="height:360px; width:640px">
  <script type="text/javascript">
    var config = {
      targetId: 'player-placeholder',
      provider: {
        partnerId: {PARTNER_ID}
        ...
      },
      player: {
       plugins: {
         googleAnalytics: {
           trackingId: 'UA-1234567-89',
           trackingGA4Id: 'G-0123456789'
         }
        ...
       }
       ...
      }
     ...
    };
    var player = KalturaPlayer.setup(config);
    player.loadMedia({
      entryId: '{ENTRY_ID}'
      ...
    });
  </script>
</div>
```

## Documentation

- **[Configuration](docs/configuration.md)**

## Running the tests

Tests can be run locally via [Karma], which will run on Chrome, Firefox and Safari

[karma]: https://karma-runner.github.io/1.0/index.html

```
yarn run test
```

You can test individual browsers:

```
yarn run test:chrome
yarn run test:firefox
yarn run test:safari
```

### And coding style tests

We use ESLint [recommended set](http://eslint.org/docs/rules/) with some additions for enforcing [Flow] types and other rules.

See [ESLint config](.eslintrc.json) for full configuration.

We also use [.editorconfig](.editorconfig) to maintain consistent coding styles and settings, please make sure you comply with the styling.

## Compatibility

TBD

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-google-analytics/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
