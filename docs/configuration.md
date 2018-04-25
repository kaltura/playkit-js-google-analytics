## Configuration

#### Configuration Structure  

The configuration uses the following structure:

```js
{
  trackingId: string,
  tracking: Object
}
```
##
>### trackingId
>##### Type: `string`
>##### required: `true`
>##### Description: The Google Analytics tracking ID.
##
>### tracking
>##### Type: `Object`
>##### required: `false`
>##### Description: The tracking options.
##
>### tracking.category
>##### Type: `string | function`
>##### required: `false`
>##### Description: The default category for the events.<br>Can be a string or a function (bound to the plugin instance and gets the event as a parameter) that returns a string.
##
>### tracking.label
>##### Type: `string | function`
>##### required: `false`
>##### Description: The default label for the events.<br>Can be a string or a function (bound to the plugin instance and gets the event as a parameter) that returns a string.
##
>### tracking.value
>##### Type: `number | function`
>##### required: `false`
>##### Description: The default value for the events.<br>Can be a number or a function (bound to the plugin instance and gets the event as a parameter) that returns a number.
##
>### tracking.events
>##### Type: `Object`
>##### required: `false`
>##### Description: A map of key-value pairs which key is an event to listen, and value is an object of the parameters to send once the event triggered.<br>The full events can be found [here](https://github.com/kaltura/playkit-js/blob/master/src/event/event-type.js).
##
>### tracking.events[<event_name>].action
>##### Type: `string | function`
>##### required: `true`
>##### Description: The action to send once the <event_name> triggered.<br>Can be a string or a function (bound to the plugin instance and gets the event as a parameter) that returns a string.
##
>### tracking.events[<event_name>].category
>##### Type: `string | function`
>##### required: `false`
>##### Description: The category to send once the <event_name> triggered. if no given uses the default category.<br>Can be a string or a function (bound to the plugin instance and gets the event as a parameter) that returns a string.
##
>### tracking.events[<event_name>].label
>##### Type: `string | function`
>##### required: `false`
>##### Description: The label to send once the <event_name> triggered. if no given uses the default label.<br>Can be a string or a function (bound to the plugin instance and gets the event as a parameter) that returns a string.
##
>### tracking.events[<event_name>].value
>##### Type: `function`
>##### required: `false`
>##### Description: The value to send once the <event_name> triggered. if no given uses the default value.<br>Can be a number or a function (bound to the plugin instance and gets the event as a parameter) that returns a number.
##
>### tracking.events[<event_name>].condition
>##### Type: `function`
>##### required: `false`
>##### Description: A callback (bound to the plugin instance and gets the event as a parameter). if given, the <event_name> will reported only when the condition is satisfied.
##

#### Default Configuration Values
```js
{
  tracking: {
    category: 'Kaltura Video Events',
    label: function () {
      return `${this.config.partnerId} | ${this.config.uiConfId ? `${this.config.uiConfId} | ` : ''}${this.config.entryId} | '${this.config.entryName}'`
    },
    events: {
      MEDIA_LOADED: {
        action: 'media ready'
      },
      FIRST_PLAY: {
        action: 'first play'
      },
      PLAY: {
        action: 'play',
        value: 1
      },
      PAUSE: {
        action: 'pause',
        value: 1
      },
      SEEKED: {
        action: 'seek',
        value: function () {
          return this.player.currentTime;
        }
      },
      ENDED: {
        action: 'ended'
      },
      CHANGE_SOURCE_ENDED: {
        action: 'change media',
        value: 1
      },
      ENTER_FULLSCREEN: {
        action: 'enter full screen',
        value: 1
      },
      EXIT_FULLSCREEN: {
        action: 'exit full screen',
        value: 1
      },
      ERROR: {
        action: 'error',
        category: 'Kaltura Video Error',
        label: function (error) {
          return Object.entries(Error.Code).find(([name, code]) => { // eslint-disable-line no-unused-vars
            return code === error.payload.code;
          })[0]
        },
        condition: function (error) {
          return error.payload.severity === 2;
        }
      }
    }
  }
}
```
