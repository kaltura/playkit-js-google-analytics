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
>##### Description: The google analytics account id.
##
>### tracking
>##### Type: `Object`
>##### required: `false`
>##### Description: The tracking options.
##
>### tracking.category
>##### Type: `string`
>##### required: `false`
>##### Description: The default category for the events.
##
>### tracking.label
>##### Type: `function`
>##### required: `false`
>##### Description: A callback (bound to the plugin instance) to get the default label for the events.
##
>### tracking.events
>##### Type: `Object`
>##### required: `false`
>##### Description: A map of key-value pairs which key is an event to listen, and value is an object of the parameters to send once the event triggered.<br>The full events can be found [here](https://github.com/kaltura/playkit-js/blob/master/src/event/event-type.js).
##
>### tracking.events[<event_name>].action
>##### Type: `string`
>##### required: `true`
>##### Description: The action to send once the <event_name> triggered.
##
>### tracking.events[<event_name>].category
>##### Type: `string`
>##### required: `false`
>##### Description: The category to send once the <event_name> triggered. if no given uses the default category.
##
>### tracking.events[<event_name>].label
>##### Type: `function`
>##### required: `false`
>##### Description: A callback (bound to the plugin instance) to get the label to send once the <event_name> triggered. if no given uses the default label.
##
>### tracking.events[<event_name>].value
>##### Type: `function`
>##### required: `false`
>##### Description: A callback (bound to the plugin instance) to get the value to send once the <event_name> triggered.
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
        value: function () {
          return 1;
        }
      },
      PAUSE: {
        action: 'pause',
        value: function () {
          return 1;
        }
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
        value: function () {
          return 1;
        }
      },
      ENTER_FULLSCREEN: {
        action: 'enter full screen',
        value: function () {
          return 1;
        }
      },
      EXIT_FULLSCREEN: {
        action: 'exit full screen',
        value: function () {
          return 1;
        }
      },
      ERROR: {
        action: 'no sources provided',
        category: 'Kaltura Video Error',
        label: function () {
          return '';
        },
        condition: function (error) {
          return error.payload.code === Error.Code.NO_SOURCE_PROVIDED;
        }
      }
    }
  }
}
```
