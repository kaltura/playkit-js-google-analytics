// @flow
import {registerPlugin} from 'playkit-js';
import GoogleAnalytics from './google-analytics';

declare var __VERSION__: string;
declare var __NAME__: string;

export default GoogleAnalytics;
export {__VERSION__ as VERSION, __NAME__ as NAME};

const pluginName: string = 'googleAnalytics';

registerPlugin(pluginName, GoogleAnalytics);
