import '../../src/index.js'
import {loadPlayer} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const targetId = 'player-placeholder_google-analytics.spec';

describe('GoogleAnalyticsPlugin', function () {
  let player;
  const id = '1_rwbj3j0a';
  const partnerId = 1068292;
  const uiConfId = 123456;
  const entryName = 'some name';

  const config = {
    id,
    sources: {
      progressive: [
        {
          mimetype: "video/mp4",
          url: "https://www.w3schools.com/tags/movie.mp4"
        }
      ]
    },
    plugins: {
      googleAnalytics: {
        trackingId: 'UA-1234567-89',
        entryId: id,
        entryName,
        uiConfId,
        partnerId,
        tracking: {
          events: {
            MUTE_CHANGE: {
              action: 'mute change',
              value: function () {
                return this.player.muted;
              }
            },
            PAUSE: {
              action: 'custom pause'
            },
          }
        }
      }
    }
  };

  function createPlayerPlaceholder(targetId) {
    TestUtils.createElement('DIV', targetId);
    let el = document.getElementById(targetId);
    el.style.height = '360px';
    el.style.width = '640px';
  }

  function setupPlayer(config) {
    player = loadPlayer(config);
    const el = document.getElementById(targetId);
    el.appendChild(player.getView());
  }

  function verifyEventParams(eventParams) {
    eventParams['event_category'].should.equal("Kaltura Video Events");
    eventParams['event_label'].should.equal("1068292 | 123456 | 1_rwbj3j0a | 'some name'");
  }

  function verifyEvent(eventData, eventName) {
    eventData[1].should.equal(eventName);
    verifyEventParams(eventData[2]);
  }

  before(function () {
    createPlayerPlaceholder(targetId);
  });

  beforeEach(function () {
    setupPlayer(config);
  });

  afterEach(function () {
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should send first play', (done) => {
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      verifyEvent(dataLayer[dataLayer.length - 1], 'first play');
      done();
    });
    player.play();
  });
});
