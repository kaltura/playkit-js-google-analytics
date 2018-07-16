import {Error} from 'playkit-js';

export default {
  category: 'Kaltura Video Events',
  label: function() {
    return `${this.config.partnerId} | ${this.config.uiConfId ? `${this.config.uiConfId} | ` : ''}${this.config.entryId} | '${
      this.config.entryName
    }'`;
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
      value: function() {
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
      label: function(error) {
        // eslint-disable-next-line no-unused-vars
        return Object.entries(Error.Code).find(([name, code]) => {
          return code === error.payload.code;
        })[0];
      },
      condition: function(error) {
        return error.payload.severity === Error.Severity.CRITICAL;
      }
    }
  }
};
