export default {
  label: function () {
    return `partner: ${this.config.partnerId} | ${this.config.uiConfId ? `uiconf: ${this.config.uiConfId} | ` : ''}entry id: ${this.config.entryId} | entry name: '${this.config.entryName}'`
  },
  category: 'Kaltura Video Events',
  events: {
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
    }
  }
}
