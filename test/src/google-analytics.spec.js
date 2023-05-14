import GoogleAnalytics from '../../src/index.js';
import {core, setup} from '@playkit-js/kaltura-player-js';
import * as TestUtils from './utils/test-utils';
const {FakeEvent, Error, Utils} = core;

const targetId = 'player-placeholder_google-analytics.spec';

describe('Google Analytics Plugin', function () {
  let player;
  const id = '1_rwbj3j0a';
  const partnerId = 1068292;
  const uiConfId = 123456;
  const entryName = 'some name';

  const CMid = '1_fdsfds78';
  const CMpartnerId = 876543;
  const CMuiConfId = 654321;
  const CMentryName = 'change media name';

  let config, sandbox;

  const CMconfig = {
    CMid,
    sources: {
      progressive: [
        {
          mimetype: 'video/mp4',
          url: 'https://www.w3schools.com/tags/movie.mp4'
        }
      ]
    },
    plugins: {
      googleAnalytics: {
        trackingId: 'UA-1234567-89',
        entryId: CMid,
        entryName: CMentryName,
        uiConfId: CMuiConfId,
        partnerId: CMpartnerId
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
    player = setup(config);
    const el = document.getElementById(targetId);
    el.appendChild(player.getView());
  }

  function verifyEventParams(eventData, eventParams = {}) {
    eventParams.category = eventParams.category || 'Kaltura Video Events';
    eventParams.label = eventParams.label || `${partnerId} | ${uiConfId} | ${id} | '${entryName}'`;
    eventData[2]['event_category'].should.equal(eventParams.category);
    if (eventData[2]['event_label']) {
      eventData[2]['event_label'].should.equal(eventParams.label);
    }
  }

  function verifyEventValue(eventData, value) {
    if (value) {
      eventData[2]['value'].should.equal(value);
    }
  }

  function verifyEventName(eventData, name) {
    eventData[1].should.equal(name);
  }

  before(function () {
    createPlayerPlaceholder(targetId);
  });

  afterEach(function () {
    player.destroy();
    player = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  describe('default events', () => {
    beforeEach(function () {
      config = {
        targetId,
        provider: {},
        id,
        sources: {
          progressive: [
            {
              mimetype: 'video/mp4',
              url: 'https://www.w3schools.com/tags/movie.mp4'
            }
          ]
        },
        plugins: {
          googleAnalytics: {
            trackingId: 'UA-1234567-89',
            entryId: id,
            entryName,
            uiConfId,
            partnerId
          }
        }
      };
      setupPlayer(config);
    });

    it('should send widget loaded', () => {
      verifyEventName(dataLayer[dataLayer.length - 1], 'widget loaded');
      verifyEventParams(dataLayer[dataLayer.length - 1]);
    });

    it('should send media ready', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'media ready');
          verifyEventParams(dataLayer[dataLayer.length - 1]);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });

    it('should send play & first play', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 2], 'play');
          verifyEventParams(dataLayer[dataLayer.length - 2]);
          verifyEventValue(dataLayer[dataLayer.length - 2], 1);
          verifyEventName(dataLayer[dataLayer.length - 1], 'first play');
          verifyEventParams(dataLayer[dataLayer.length - 1]);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.play();
    });

    it('should send pause', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.addEventListener(player.Event.PAUSE, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 1], 'pause');
            verifyEventParams(dataLayer[dataLayer.length - 1]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 1);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.pause();
      });
      player.play();
    });

    it('should send play', done => {
      player.addEventListener(player.Event.FIRST_PLAY, () => {
        player.addEventListener(player.Event.PAUSE, () => {
          player.addEventListener(player.Event.PLAY, () => {
            try {
              verifyEventName(dataLayer[dataLayer.length - 1], 'play');
              verifyEventParams(dataLayer[dataLayer.length - 1]);
              verifyEventValue(dataLayer[dataLayer.length - 1], 1);
              done();
            } catch (e) {
              done(e);
            }
          });
          player.play();
        });
        player.pause();
      });
      player.play();
    });

    it('should send seek', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 1], 'seek');
            verifyEventParams(dataLayer[dataLayer.length - 1]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 2);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.currentTime = 2;
      });
      player.load();
    });

    it('should send 25% watched', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 2], '25% watched');
            verifyEventParams(dataLayer[dataLayer.length - 2]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 5);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.currentTime = 5;
      });
      player.load();
    });

    it('should send 50% watched', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 2], '50% watched');
            verifyEventParams(dataLayer[dataLayer.length - 2]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 7);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.currentTime = 7;
      });
      player.load();
    });

    it('should send 75% watched', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 2], '75% watched');
            verifyEventParams(dataLayer[dataLayer.length - 2]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 10);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.currentTime = 10;
      });
      player.load();
    });

    it('should send 100% watched & ended', done => {
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          player.addEventListener(player.Event.ENDED, () => {
            try {
              verifyEventName(dataLayer[dataLayer.length - 3], '100% watched');
              verifyEventParams(dataLayer[dataLayer.length - 3]);
              verifyEventValue(dataLayer[dataLayer.length - 3], 13);
              verifyEventName(dataLayer[dataLayer.length - 1], 'ended');
              verifyEventParams(dataLayer[dataLayer.length - 1]);
              done();
            } catch (e) {
              done(e);
            }
          });
          player.play();
        });
        player.currentTime = 12;
      });
      player.load();
    });

    it('should send enter full screen', done => {
      sinon.stub(player._localPlayer, 'isFullscreen').callsFake(() => true);
      player.addEventListener(player.Event.ENTER_FULLSCREEN, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'enter full screen');
          verifyEventParams(dataLayer[dataLayer.length - 1]);
          verifyEventValue(dataLayer[dataLayer.length - 1], 1);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.notifyEnterFullscreen();
    });

    it('should send exit full screen', done => {
      let isFullscreen = true;
      sinon.stub(player._localPlayer, 'isFullscreen').callsFake(() => isFullscreen);
      player.addEventListener(player.Event.ENTER_FULLSCREEN, () => {
        isFullscreen = false;
        player.addEventListener(player.Event.EXIT_FULLSCREEN, () => {
          try {
            verifyEventName(dataLayer[dataLayer.length - 1], 'exit full screen');
            verifyEventParams(dataLayer[dataLayer.length - 1]);
            verifyEventValue(dataLayer[dataLayer.length - 1], 1);
            done();
          } catch (e) {
            done(e);
          }
        });
        player.notifyExitFullscreen();
      });
      player.notifyEnterFullscreen();
    });

    it('should not send change media', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_ENDED, () => {
        done('sent changed media');
      });
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        player.addEventListener(player.Event.SEEKED, () => {
          player.addEventListener(player.Event.ENDED, () => {
            done();
          });
          player.play();
        });
        player.currentTime = 12;
      });
      player.load();
    });

    it('should send change media', done => {
      player.addEventListener(player.Event.CHANGE_SOURCE_ENDED, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'change media');
          verifyEventParams(dataLayer[dataLayer.length - 1], {label: `${CMpartnerId} | ${CMuiConfId} | ${CMid} | '${CMentryName}'`});
          verifyEventValue(dataLayer[dataLayer.length - 1], 1);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.configure(CMconfig);
    });

    it('should send critical error', done => {
      player.addEventListener(player.Event.ERROR, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'error');
          verifyEventParams(dataLayer[dataLayer.length - 1], {
            category: 'Kaltura Video Error',
            label: 'NO_SOURCE_PROVIDED'
          });
          done();
        } catch (e) {
          done(e);
        }
      });
      player.dispatchEvent(new FakeEvent('error', new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.NO_SOURCE_PROVIDED)));
    });

    it('should not send non critical error', done => {
      player.addEventListener(player.Event.ERROR, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'widget loaded');
          done();
        } catch (e) {
          done(e);
        }
      });
      player.dispatchEvent(new FakeEvent('error', new Error(Error.Severity.RECOVERABLE, Error.Category.PLAYER, Error.Code.NO_SOURCE_PROVIDED)));
    });
  });

  describe('configuration', () => {
    beforeEach(function () {
      config = {
        targetId,
        provider: {},
        id,
        sources: {
          progressive: [
            {
              mimetype: 'video/mp4',
              url: 'https://www.w3schools.com/tags/movie.mp4'
            }
          ]
        },
        plugins: {
          googleAnalytics: {
            trackingId: 'UA-1234567-89',
            entryId: id,
            entryName,
            uiConfId,
            partnerId
          }
        }
      };
    });

    it('should do nothing for no trackingId given', () => {
      window.dataLayer = null;
      config.plugins.googleAnalytics.trackingId = null;
      setupPlayer(config);
      (!window.dataLayer).should.be.true;
    });

    it('override default category - string', () => {
      config.plugins.googleAnalytics.tracking = {
        category: 'custom string category'
      };
      setupPlayer(config);
      verifyEventParams(dataLayer[dataLayer.length - 1], {category: 'custom string category'});
    });

    it('override default category - function', () => {
      config.plugins.googleAnalytics.tracking = {
        category: function (event = {type: 'custom'}) {
          return `${event.type} ${this.config.uiConfId}`;
        }
      };
      setupPlayer(config);
      verifyEventParams(dataLayer[dataLayer.length - 1], {category: 'custom 123456'});
    });

    it('override default label - string', done => {
      config.plugins.googleAnalytics.tracking = {
        label: 'custom string label'
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventParams(dataLayer[dataLayer.length - 1], {label: 'custom string label'});
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });

    it('override default label - function', done => {
      config.plugins.googleAnalytics.tracking = {
        label: function (event) {
          return `${event.type} ${this.config.uiConfId}`;
        }
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventParams(dataLayer[dataLayer.length - 1], {label: 'medialoaded 123456'});
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });

    it('override default value - number (round down)', done => {
      config.plugins.googleAnalytics.tracking = {
        value: 10.1
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventValue(dataLayer[dataLayer.length - 1], 10);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });

    it('override default value - function (round up)', done => {
      config.plugins.googleAnalytics.tracking = {
        value: function (event) {
          return event.type.length + this.name.length + 0.9;
        }
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventValue(dataLayer[dataLayer.length - 1], 27);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });

    it('custom event - strings', done => {
      config.plugins.googleAnalytics.tracking = {
        events: {
          MUTE_CHANGE: {
            action: 'mute',
            category: 'custom category',
            label: 'custom label',
            value: 0
          }
        }
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MUTE_CHANGE, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'mute');
          verifyEventParams(dataLayer[dataLayer.length - 1], {category: 'custom category', label: 'custom label'});
          verifyEventValue(dataLayer[dataLayer.length - 1], 0);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.muted = true;
    });

    it('custom event - functions', done => {
      config.plugins.googleAnalytics.tracking = {
        events: {
          MUTE_CHANGE: {
            action: function (event) {
              return `mute ${event.type.length + this.name.length}`;
            },
            category: function (event) {
              return `custom category ${event.type.length + this.name.length}`;
            },
            label: function (event) {
              return `custom label ${event.type.length + this.name.length}`;
            },
            value: function (event) {
              return event.type.length + this.name.length;
            }
          }
        }
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MUTE_CHANGE, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'mute 25');
          verifyEventParams(dataLayer[dataLayer.length - 1], {
            category: 'custom category 25',
            label: 'custom label 25'
          });
          verifyEventValue(dataLayer[dataLayer.length - 1], 25);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.muted = true;
    });

    it('override event', done => {
      config.plugins.googleAnalytics.tracking = {
        events: {
          MEDIA_LOADED: {
            action: 'custom media ready',
            category: 'custom category'
          }
        }
      };
      setupPlayer(config);
      player.addEventListener(player.Event.MEDIA_LOADED, () => {
        try {
          verifyEventName(dataLayer[dataLayer.length - 1], 'custom media ready');
          verifyEventParams(dataLayer[dataLayer.length - 1], {category: 'custom category'});
          done();
        } catch (e) {
          done(e);
        }
      });
      player.load();
    });
  });

  describe('UA and GA4', () => {
    beforeEach(function () {
      window.dataLayer = null;
      sandbox = sinon.createSandbox();
    });

    afterEach(function () {
      sandbox.restore();
      Utils.Dom.loadScriptAsync.restore();
    });

    it('Should send for both UA and GA4', done => {
      sinon.stub(Utils.Dom, 'loadScriptAsync').callsFake(url => {
        try {
          url.should.equal(`${GoogleAnalytics.GTAG_LIB_URL}?id=UA-1234567-89`);
        } catch (e) {
          done(e);
        }
        return Promise.resolve();
      });
      config = {
        targetId,
        provider: {},
        id,
        sources: {
          progressive: [
            {
              mimetype: 'video/mp4',
              url: 'https://www.w3schools.com/tags/movie.mp4'
            }
          ]
        },
        plugins: {
          googleAnalytics: {
            trackingId: 'UA-1234567-89',
            trackingGA4Id: 'G-0123456789'
          }
        }
      };
      setupPlayer(config);
      Array.from(dataLayer[1]).should.deep.equal(['config', 'UA-1234567-89']);
      Array.from(dataLayer[2]).should.deep.equal(['config', 'G-0123456789']);
      done();
    });

    it('Should send for UA only', done => {
      sinon.stub(Utils.Dom, 'loadScriptAsync').callsFake(url => {
        try {
          url.should.equal(`${GoogleAnalytics.GTAG_LIB_URL}?id=UA-1234567-89`);
        } catch (e) {
          done(e);
        }
        return Promise.resolve();
      });
      config = {
        targetId,
        provider: {},
        id,
        sources: {
          progressive: [
            {
              mimetype: 'video/mp4',
              url: 'https://www.w3schools.com/tags/movie.mp4'
            }
          ]
        },
        plugins: {
          googleAnalytics: {
            trackingId: 'UA-1234567-89'
          }
        }
      };
      setupPlayer(config);
      Array.from(dataLayer[1]).should.deep.equal(['config', 'UA-1234567-89']);
      dataLayer[2][0].should.not.equal('config');
      done();
    });

    it('Should send for GA4 only', done => {
      sinon.stub(Utils.Dom, 'loadScriptAsync').callsFake(url => {
        try {
          url.should.equal(`${GoogleAnalytics.GTAG_LIB_URL}?id=G-0123456789`);
        } catch (e) {
          done(e);
        }
        return Promise.resolve();
      });
      config = {
        targetId,
        provider: {},
        id,
        sources: {
          progressive: [
            {
              mimetype: 'video/mp4',
              url: 'https://www.w3schools.com/tags/movie.mp4'
            }
          ]
        },
        plugins: {
          googleAnalytics: {
            trackingGA4Id: 'G-0123456789'
          }
        }
      };
      setupPlayer(config);
      Array.from(dataLayer[1]).should.deep.equal(['config', 'G-0123456789']);
      dataLayer[2][0].should.not.equal('config');
      done();
    });
  });
});
