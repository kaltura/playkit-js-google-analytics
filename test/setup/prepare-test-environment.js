import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon/pkg/sinon';

/**
 * @returns {void}
 */
export function prepareTestEnvironment() {
  chai.should();
  chai.use(sinonChai);
  global.chai = chai;
  global.expect = chai.expect;
  global.should = chai.should;
  global.sinon = sinon;
  document.cookie = 'test=1';
}

export default prepareTestEnvironment;
