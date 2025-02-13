// @flow
import {core, BasePlugin} from '@playkit-js/kaltura-player-js';
import defaultTracking from './default-tracking';

const {Utils} = core;
const WIDGET_LOADED_ACTION: string = 'widget loaded';
const PCT_25_ACTION: string = '25% watched';
const PCT_50_ACTION: string = '50% watched';
const PCT_75_ACTION: string = '75% watched';
const PCT_100_ACTION: string = '100% watched';

/**
 * Your class description.
 * @classdesc
 */
export default class GoogleAnalytics extends BasePlugin {
  /**
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   */
  static defaultConfig: Object = {
    tracking: defaultTracking
  };

  /**
   * @static
   * @public
   * @returns {boolean} - Whether the plugin is valid.
   */
  static isValid(): boolean {
    return true;
  }

  /**
   * The gtag lib url.
   * @type {string}
   * @static
   */
  static GTAG_LIB_URL: string = '//www.googletagmanager.com/gtag/js';

  /**
   * Indicate whether time percent event already sent
   * @private
   */
  _timePercentEvent: {[event: string]: boolean} = {
    PLAY_REACHED_25: false,
    PLAY_REACHED_50: false,
    PLAY_REACHED_75: false,
    PLAY_REACHED_100: false
  };

  /**
   * Indicate whether its the first entry that is played
   * @private
   */
  _firstEntry: boolean = true;

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player instance.
   * @param {Object} config - The plugin config.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    if (document.cookie) {
      if (this.config.trackingId || this.config.trackingGA4Id) {
        this._init();
        this._addBindings();
        this._sendEvent({
          action: WIDGET_LOADED_ACTION,
          category: this._getValue(this.config.tracking.category)
        });
      } else {
        this.logger.warn('No Google Analytics tracking ID provided. Tracking aborted');
      }
    } else {
      this.logger.warn('No cookies enabled. Tracking aborted');
    }
  }

  /**
   * _gtag - update the dataLayer for gtag manager
   * @private
   * @returns {void}
   */
  _gtag() {
    window.dataLayer.push(arguments);
  }

  /**
   * _init
   * @private
   * @returns {void}
   */
  _init(): void {
    if (!window.google_tag_manager) {
      Utils.Dom.loadScriptAsync(`${GoogleAnalytics.GTAG_LIB_URL}?id=${this.config.trackingId || this.config.trackingGA4Id}`).then(() => {
        this.logger.debug('Google gtag library has loaded successfully');
      });
    }
    window.dataLayer = window.dataLayer || [];
    // $FlowFixMe
    this._gtag('js', new Date());
    // $FlowFixMe
    this.config.trackingId && this._gtag('config', this.config.trackingId);
    // $FlowFixMe
    this.config.trackingGA4Id && this._gtag('config', this.config.trackingGA4Id);
  }

  /**
   * _getValue - returns the value itself or the returned value if it's a function
   * @param {string | number | function} val - the value to return or calculate
   * @param {?Object} event - passing to the function if exist
   * @returns {?string | ?number} - the returned value
   * @private
   */
  _getValue(val: any, event: ?Object): any {
    try {
      return typeof val === 'function' ? val.call(this, event) : val;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  /**
   * _addBindings
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    Object.entries(this.config.tracking.events).forEach(([eventName, eventParams]) => {
      this.eventManager.listen(this.player, this.player.Event[eventName], event => {
        const shouldSendEvent = (eventParams: Object) => {
          return eventParams.action && (typeof eventParams.condition === 'function' ? eventParams.condition.call(this, event) : true);
        };
        if (eventParams && typeof eventParams === 'object' && shouldSendEvent(eventParams)) {
          const customCategory = this._getValue(eventParams.category, event);
          const customLabel = this._getValue(eventParams.label, event);
          const customValue = this._getValue(eventParams.value, event);
          const eventObj = {
            action: this._getValue(eventParams.action, event),
            category: typeof customCategory === 'string' ? customCategory : this._getValue(this.config.tracking.category, event),
            label: typeof customLabel === 'string' ? customLabel : this._getValue(this.config.tracking.label, event),
            value: typeof customValue === 'number' ? customValue : this._getValue(this.config.tracking.value, event)
          };
          this._sendEvent(eventObj);
        }
      });
    });
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._sendTimePercentAnalytic.bind(this));
    this.eventManager.listenOnce(this.player, this.player.Event.CHANGE_SOURCE_ENDED, () => (this._firstEntry = false));
  }

  /**
   * Send time percent analytic
   * @param {Object} event - 'timeupdate' event
   * @private
   * @return {void}
   */
  _sendTimePercentAnalytic(event: Object): void {
    const getPctEventParams = () => {
      return {
        category: this._getValue(this.config.tracking.category, event),
        label: this._getValue(this.config.tracking.label, event),
        value: this.player.currentTime
      };
    };
    if (this.player.config.sources.type !== this.player.MediaType.LIVE) {
      const percent = this.player.currentTime / this.player.duration;
      if (!this._timePercentEvent.PLAY_REACHED_25 && percent >= 0.25) {
        this._timePercentEvent.PLAY_REACHED_25 = true;
        this._sendEvent({
          action: PCT_25_ACTION,
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_50 && percent >= 0.5) {
        this._timePercentEvent.PLAY_REACHED_50 = true;
        this._sendEvent({
          action: PCT_50_ACTION,
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_75 && percent >= 0.75) {
        this._timePercentEvent.PLAY_REACHED_75 = true;
        this._sendEvent({
          action: PCT_75_ACTION,
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_100 && percent >= 1) {
        this._timePercentEvent.PLAY_REACHED_100 = true;
        this._sendEvent({
          action: PCT_100_ACTION,
          ...getPctEventParams()
        });
      }
    }
  }

  /**
   * _sendEvent
   * @param {Object} event - event to send
   * @private
   * @returns {void}
   */
  _sendEvent(event: Object) {
    if (event.action) {
      const eventProps = {};
      eventProps['event_category'] = event.category;
      if (event.label) {
        eventProps['event_label'] = event.label;
      }
      if (typeof event.value === 'number') {
        eventProps['value'] = Math.round(event.value);
      }
      this.logger.debug(`${event.action} event sent`, eventProps);
      // $FlowFixMe
      this._gtag('event', event.action, eventProps);
    }
  }

  /**
   * Destroys the plugin.
   * @override
   * @public
   * @returns {void}
   */
  destroy(): void {
    this.eventManager.destroy();
  }

  /**
   * Resets the plugin.
   * @override
   * @public
   * @returns {void}
   */
  reset(): void {
    this._timePercentEvent = {
      PLAY_REACHED_25: false,
      PLAY_REACHED_50: false,
      PLAY_REACHED_75: false,
      PLAY_REACHED_100: false
    };
  }
}
