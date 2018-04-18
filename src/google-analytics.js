// @flow
import {BasePlugin, Utils} from 'playkit-js'
import defaultTracking from './default-tracking'

const LIVE: string = 'Live';

/**
 * Your class description.
 * @classdesc
 */
export default class GoogleAnalytics extends BasePlugin {
  /**
   * TODO: Override and define your default configuration for the plugin.
   * The default configuration of the plugin.
   * @type {Object}
   * @static
   */
  static defaultConfig: Object = {
    tracking: defaultTracking
  };

  /**
   * TODO: Define under what conditions the plugin is valid.
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
      action: 'widget loaded',
      category: this.config.tracking.category
    });
  }

  /**
   * _init
   * @private
   * @returns {void}
   */
  _init(): void {
    if (this.config.trackingId) {
      Utils.Dom.loadScriptAsync(`${GoogleAnalytics.GTAG_LIB_URL}?id=${this.config.trackingId}`).then(() => {
        this.logger.debug('Google gtag library has loaded successfully');
      });
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        dataLayer.push(arguments);
      };
      gtag('js', new Date());
      gtag('config', this.config.trackingId);
    }
  }

  /**
   * _addBindings
   * @private
   * @returns {void}
   */
  _addBindings(): void {
    Object.entries(this.config.tracking.events).forEach(([eventName, eventParams]) => {
      this.eventManager.listen(this.player, this.player.Event[eventName], () => {
        try {
          const eventObj = {
            action: eventParams.action,
            category: eventParams.category || this.config.tracking.category,
            label: eventParams.label ? eventParams.label.call(this) : this.config.tracking.label.call(this),
            value: eventParams.value ? eventParams.value.call(this) : undefined
          };
          this._sendEvent(eventObj);
        }
        catch (e) {
          this.logger.error(e);
          return;
        }
      });
    });
    this.eventManager.listen(this.player, this.player.Event.SOURCE_SELECTED, () => {
      this.player.ready().then(() => {
        this._sendEvent({
          action: 'media ready',
          category: this.config.tracking.category,
          label: this.config.tracking.label.call(this)
        });
      });
    });
    this.eventManager.listen(this.player, this.player.Event.TIME_UPDATE, this._sendTimePercentAnalytic.bind(this));
    this.eventManager.listen(this.player, this.player.Event.ERROR, (error) => {
      if (error.payload.code === KalturaPlayer.core.Error.Code.NO_SOURCE_PROVIDED) {
        this._sendEvent({
          action: 'no sources provided',
          category: 'Kaltura Video Error'
        });
      }
    });
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
        label: this.config.tracking.label.call(this),
        value: this.player.currentTime
      }
    };
    if (this.player.config.type !== LIVE) {
      const percent = this.player.currentTime / this.player.duration;
      if (!this._timePercentEvent.PLAY_REACHED_25 && percent >= .25) {
        this._timePercentEvent.PLAY_REACHED_25 = true;
        this._sendEvent({
          action: '25 pct watched',
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_50 && percent >= .50) {
        this._timePercentEvent.PLAY_REACHED_50 = true;
        this._sendEvent({
          action: '50 pct watched',
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_75 && percent >= .75) {
        this._timePercentEvent.PLAY_REACHED_75 = true;
        this._sendEvent({
          action: '75 pct watched',
          ...getPctEventParams()
        });
      }
      if (!this._timePercentEvent.PLAY_REACHED_100 && percent >= 1) {
        this._timePercentEvent.PLAY_REACHED_100 = true;
        this._sendEvent({
          action: '100 pct watched',
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
    const eventProps = {
      event_category: event.category
    };
    if (event.label) {
      eventProps['event_label'] = event.label
    }
    if (event.value !== undefined && event.value !== null) {
      eventProps['value'] = event.value
    }
    this.logger.debug(`${event.action} event sent`, eventProps);
    gtag('event', event.action, eventProps);
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
