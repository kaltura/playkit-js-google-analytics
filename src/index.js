// @flow
import {registerPlugin} from 'playkit-js';
import GoogleAnalytics from './google-analytics';

declare var __VERSION__: string;
declare var __NAME__: string;

const VERSION = __VERSION__;
const NAME = __NAME__;

export default GoogleAnalytics;
export {VERSION, NAME};

const pluginName: string = 'googleAnalytics';

registerPlugin(pluginName, GoogleAnalytics);
