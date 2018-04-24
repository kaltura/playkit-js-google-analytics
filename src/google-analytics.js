// @flow
import {BasePlugin, Utils} from 'playkit-js'
import defaultTracking from './default-tracking'

const WIDGET_LOADED_ACTION: string = 'widget loaded';
const PCT_25_ACTION: string = '25 pct watched';
const PCT_50_ACTION: string = '50 pct watched';
const PCT_75_ACTION: string = '75 pct watched';
const PCT_100_ACTION: string = '100 pct watched';

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
  static GTAG_LIB_URL: string = "//www.googletagmanager.com/gtag/js";

  /**
   * Indicate whether time percent event already sent
   * @private
   */
  _timePercentEvent: { [event: string]: boolean } = {
    PLAY_REACHED_25: false,
    PLAY_REACHED_50: false,
    PLAY_REACHED_75: false,
    PLAY_REACHED_100: false
  };

  /**
   * @constructor
   * @param {string} name - The plugin name.
   * @param {Player} player - The player instance.
   * @param {Object} config - The plugin config.
   */
  constructor(name: string, player: Player, config: Object) {
    super(name, player, config);
    this._init();
    this._addBindings();
    this._sendEvent({
      action: WIDGET_LOADED_ACTION,
      category: this.config.tracking.category
    });
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
    if (this.config.trackingId) {
      if (!window.google_tag_manager) {
        Utils.Dom.loadScriptAsync(`${GoogleAnalytics.GTAG_LIB_URL}?id=${this.config.trackingId}`).then(() => {
          this.logger.debug('Google gtag library has loaded successfully');
        });
      }
      window.dataLayer = window.dataLayer || [];
      // $FlowFixMe
      this._gtag('js', new Date());
      // $FlowFixMe
      this._gtag('config', this.config.trackingId);
    }
  }

  /**
   * _addBindings
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    const shouldSentEvent = (condition, event) => {
      return typeof condition === 'function' ? condition.call(this, event) : true;
    };

    Object.entries(this.config.tracking.events).forEach(([eventName, eventParams]) => {
      this.eventManager.listen(this.player, this.player.Event[eventName], (event) => {
        try {
          if (eventParams && typeof eventParams === 'object' && eventParams.action && shouldSentEvent(eventParams.condition, event)) {
            const eventObj = {
              action: eventParams.action,
              category: eventParams.category || this.config.tracking.category,
              label: typeof eventParams.label === 'function' ? eventParams.label.call(this, event) : this.config.tracking.label.call(this, event),
              value: typeof eventParams.value === 'function' ? eventParams.value.call(this, event) : this.config.tracking.value.call(this, event)
            };
            this._sendEvent(eventObj);
          }
        }
        catch (e) {
          this.logger.error(e);
          return;
        }
      });
    });
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._sendTimePercentAnalytic.bind(this));
  }

  /**
   * Send time percent analytic
   * @private
   * @return {void}
   */
  _sendTimePercentAnalytic(): void {
    const getPctEventParams = () => {
      return {
        category: this.config.tracking.category,
        label: this.config.tracking.label.call(this, event),
        value: this.player.currentTime
      }
    };
    if (this.player.config.type !== this.player.MediaType.LIVE) {
      const percent = this.player.currentTime / this.player.duration;
      if (!this._timePercentEvent.PLAY_REACHED_25 && percent >= .25) {
        this._timePercentEvent.PLAY_REACHED_25 = true;
        this._sendEvent({
          action: PCT_25_ACTION,
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_50 && percent >= .50) {
        this._timePercentEvent.PLAY_REACHED_50 = true;
        this._sendEvent({
          action: PCT_50_ACTION,
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_75 && percent >= .75) {
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
    const eventProps = {};
    eventProps['event_category'] = event.category;
    if (event.label) {
      eventProps['event_label'] = event.label
    }
    if (typeof event.value === 'number') {
      eventProps['value'] = event.value
    }
    this.logger.debug(`${event.action} event sent`, eventProps);
    // $FlowFixMe
    this._gtag('event', event.action, eventProps);
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
