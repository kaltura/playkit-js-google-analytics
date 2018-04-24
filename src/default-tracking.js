import {Error} from 'playkit-js';

export default {
  label: function () {
    return `${this.config.partnerId} | ${this.config.uiConfId ? `${this.config.uiConfId} | ` : ''}${this.config.entryId} | '${this.config.entryName}'`
  },
  category: 'Kaltura Video Events',
  events: {
    MEDIA_READY: {
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
