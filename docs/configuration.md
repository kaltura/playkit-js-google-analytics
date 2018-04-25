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
>>### tracking.category
>>##### Type: `string | function`
>>##### required: `false`
>>##### Description: The default category for the events.<br>Can be a string or a function<sup id="a1">[1](#f1)</sup> that returns a string.
##
>>### tracking.label
>>##### Type: `string | function`
>>##### required: `false`
>>##### Description: The default label for the events.<br>Can be a string or a function<sup id="a1">[1](#f1)</sup> that returns a string.
##
>>### tracking.value
>>##### Type: `number | function`
>>##### required: `false`
>>##### Description: The default value for the events.<br>Can be a number or a function<sup id="a1">[1](#f1)</sup> that returns a number.
##
>>### tracking.events
>>##### Type: `Object`
>>##### required: `false`
>>##### Description: A map of key-value pairs which key is an event to listen, and value is an object of the parameters to send once the event triggered.<br>The full events can be found [here](https://github.com/kaltura/playkit-js/blob/master/src/event/event-type.js).
##
>>>### tracking.events[<event_name>].action
>>>##### Type: `string | function`
>>>##### required: `true`>
>>>##### Description: The action to send once the <event_name> triggered.<br>Can be a string or a function<sup id="a1">[1](#f1)</sup> that returns a string.
##
>>>### tracking.events[<event_name>].category
>>>##### Type: `string | function`
>>>##### required: `false`
>>>##### Description: The category to send once the <event_name> triggered. if no given uses the default category.<br>Can be a string or a function<sup id="a1">[1](#f1)</sup> that returns a string.
##
>>>### tracking.events[<event_name>].label
>>>##### Type: `string | function`
>>>##### required: `false`
>>>##### Description: The label to send once the <event_name> triggered. if no given uses the default label.<br>Can be a string or a function<sup id="a1">[1](#f1)</sup> that returns a string.
##
>>>### tracking.events[<event_name>].value
>>>##### Type: `number | function`
>>>##### required: `false`
>>>##### Description: The value to send once the <event_name> triggered. if no given uses the default value.<br>Can be a number or a function<sup id="a1">[1](#f1)</sup> that returns a number.
##
>>>### tracking.events[<event_name>].condition
>>>##### Type: `function`
>>>##### required: `false`
>>>##### Description: A callback<sup id="a1">[1](#f1)</sup>. if given, the <event_name> will reported only when the condition is satisfied.
##

#### Default Configuration Values

The default config can be found [here](../src/default-tracking.js).

><b id="f1"></b> bound to the plugin instance and gets the event as a parameter [↩](#a1)
