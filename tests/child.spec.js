/**
 * @jest-environment jsdom
 */
import PostMessageEventNamesEnum from '../src//enums/PostMessageEventNamesEnum';
import WarningTextEnum from '../src/enums/WarningTextEnum';

import Child from '../src/child';

const localStorageMock = (() => {
  let store = new Map();
  return {
    getItem(key) {
      if (store.has(key)) {
        return store.get(key);
      }
      return null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    clear() {
      store.clear();
    },
    removeItem(key) {
      store.delete(key);
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

let child;
describe('Child', () => {
  beforeEach(() => {
    localStorageMock.clear();
    child = new Child();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('Basic tests', () => {
    it('verify it is defined and its methods', () => {
      expect(child).toBeDefined();
      expect(child._isSessionStorage).toBeDefined();
      expect(child._getData).toBeDefined();
      expect(child._setData).toBeDefined();
      expect(child._restoreData).toBeDefined();
      expect(child._parseData).toBeDefined();
      expect(child.onCommunication).toBeDefined();
      expect(child.addListeners).toBeDefined();
      expect(child.setHandshakeExpiry).toBeDefined();
      expect(child.sendMessageToParent).toBeDefined();
      expect(child.getTabInfo).toBeDefined();
      expect(child.init).toBeDefined();
    });
  });

  describe('method: _isSessionStorage', () => {
    it('should check if session storage is defined', () => {
      expect(child._isSessionStorage()).toBe(true);
    });
  });
  describe('method: _getData', () => {
    it('should get data from sessionStorage', () => {
      jest.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => { });
      child._getData();
      expect(window.sessionStorage.getItem).toHaveBeenCalledWith(child.sessionStorageKey);
    });

    it('should return false if sessionStorage is not supported', () => {
      // mock
      child.isSessionStorageSupported = false;
      expect(child._getData()).toBe(false);
    });
  });
  describe('method: _setData', () => {
    it('should set data in sessionStorage', () => {
      jest.spyOn(window.sessionStorage, 'setItem').mockImplementation(() => { });
      child._setData('');
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
    });

    it('should return false if sessionStorage is not supported', () => {
      // mock
      child.isSessionStorageSupported = false;
      expect(child._setData('')).toBe(false);
    });
  });
  describe('method: _restoreData', () => {
    it('should get data from sessionStorage adn parse it', () => {
      jest.spyOn(window.sessionStorage, 'getItem').mockImplementation(() => { });
      jest.spyOn(child, '_parseData').mockImplementation(() => { });
      child._restoreData();
      expect(window.sessionStorage.getItem).toHaveBeenCalled();
      expect(child._parseData).toHaveBeenCalled();
    });

    it('should return false if sessionStorage is not supported', () => {
      // mock
      child.isSessionStorageSupported = false;
      expect(child._restoreData()).toBe(false);
    });
  });
  describe('method: _parseData', () => {
    it('should throw error if data passed is not valid JSON', () => {
      expect(child._parseData).toThrow(new Error(WarningTextEnum.INVALID_DATA));
    });
    it('should parse stringified data', () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => { });

      const _child = new Child();

      _child._parseData(JSON.stringify({ a: 1 }));
      expect(JSON.parse).toHaveBeenCalled();
    });
    it('should parse stringified data with a custom parser', () => {
      const custom = {
        parse: msg => JSON.parse(msg, () => '')
      };

      jest.spyOn(custom, 'parse').mockImplementation(() => { });

      const _child = new Child({
        parse: custom.parse
      });

      _child._parseData(JSON.stringify({ a: 1 }));
      expect(custom.parse).toHaveBeenCalled();
    });
  });
  describe('method: onCommunication', () => {
    it('should clear timeout on getting message from parent', () => {
      jest.spyOn(window, 'clearTimeout').mockImplementation(() => { });
      child.onCommunication({ data: 'Hello' });
      expect(window.clearTimeout).toHaveBeenCalledWith(child.timeout);
    });
    it('should call user-defined callback when PARENT_DISCONNECTED event', () => {
      let child = new Child({
        onParentDisconnect: function () { }
      });

      jest.spyOn(child.config, 'onParentDisconnect').mockImplementation(() => { });

      child.onCommunication({ data: PostMessageEventNamesEnum.PARENT_DISCONNECTED });

      expect(child.config.onParentDisconnect).toHaveBeenCalled();
    });
    it('should remove listener when PARENT_DISCONNECTED event', () => {
      let spy = jest.fn();

      jest.spyOn(window, 'removeEventListener').mockImplementation(() => { });

      // postMessage runs asynchronously, verify after the message has been posted and after the event has been fired off.
      window.removeEventListener('message', e => {
        spy();
      });

      child.onCommunication({ data: PostMessageEventNamesEnum.PARENT_DISCONNECTED });

      expect(window.removeEventListener).toHaveBeenCalled();
    });

    it('should call user-defined method when HANDSHAKE_WITH_PARENT event', () => {
      let child = new Child({
        onInitialize: function () { }
      });

      jest.spyOn(child, '_setData').mockImplementation(() => { });
      jest.spyOn(child, '_parseData').mockImplementation(() => { });
      jest.spyOn(child, 'sendMessageToParent').mockImplementation(() => { });

      jest.spyOn(child.config, 'onInitialize').mockImplementation(() => { });

      child.onCommunication({
        data: PostMessageEventNamesEnum.HANDSHAKE_WITH_PARENT + JSON.stringify({ a: 1 })
      });

      expect(child._setData).toHaveBeenCalled();
      expect(child._parseData).toHaveBeenCalled();
      expect(child.sendMessageToParent).toHaveBeenCalled();
      expect(child.config.onInitialize).toHaveBeenCalled();
    });
    it('should call user-defined method when PARENT_COMMUNICATED event', () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => { });

      let child = new Child({
        onParentCommunication: function () { }
      });

      jest.spyOn(child.config, 'onParentCommunication').mockImplementation(() => { });

      child.onCommunication({
        data: PostMessageEventNamesEnum.PARENT_COMMUNICATED + JSON.stringify({ a: 1 })
      });

      expect(JSON.parse).toHaveBeenCalled();
      expect(child.config.onParentCommunication).toHaveBeenCalled();
    });
    it('should call user-defined method when PARENT_COMMUNICATED event with a custom parser', () => {
      const custom = {
        parse: msg => JSON.parse(msg, () => '')
      };

      jest.spyOn(custom, 'parse').mockImplementation(() => { });

      let child = new Child({
        onParentCommunication: function () { },
        parse: custom.parse
      });

      jest.spyOn(child.config, 'onParentCommunication').mockImplementation(() => { });

      child.onCommunication({
        data: PostMessageEventNamesEnum.PARENT_COMMUNICATED + JSON.stringify({ a: 1 })
      });

      expect(custom.parse).toHaveBeenCalled();
      expect(child.config.onParentCommunication).toHaveBeenCalled();
    });
  });
  describe('method: addListeners', () => {
    it('should attach events to window', () => {
      let spy = jest.fn();

      jest.spyOn(window, 'removeEventListener').mockImplementation(() => { });
      jest.spyOn(window, 'addEventListener').mockImplementation(() => { });

      // postMessage runs asynchronously, verify after the message has been posted and after the event has been fired off.
      window.removeEventListener('message', e => {
        spy();
      });
      window.addEventListener('message', e => {
        spy();
      });

      child.addListeners();

      expect(window.removeEventListener).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
    });
  });
  describe('method: setHandshakeExpiry', () => {
    it('should set a timeout', () => {
      jest.spyOn(window, 'setTimeout').mockImplementation(() => { });
      child.setHandshakeExpiry();
      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), child.handshakeExpiryLimit);
    });
  });
  describe('method: sendMessageToParent', () => {
    it('should send a postmessage to parent', () => {
      window.top.opener = {
        postMessage: function () {
          // ...
        }
      };

      jest.spyOn(window.top.opener, 'postMessage').mockImplementation(() => { });
      child.sendMessageToParent('Hello Parent');
      expect(window.top.opener.postMessage).toHaveBeenCalled();
    });
  });
  xdescribe('method: getTabInfo', () => {
    it('should return an object', () => {
      console.log('child.getTabInfo() :>> ', child.getTabInfo());
      expect(child.getTabInfo()).toBeDefined();
      expect(child.getTabInfo().id).toBeDefined();
      expect(child.getTabInfo().name).toBeDefined();
      expect(child.getTabInfo().parentName).toBeDefined();
    });
  });
  describe('method: init', () => {
    it('should be called on init', () => {
      jest.spyOn(child, 'addListeners').mockImplementation(() => { });
      jest.spyOn(child, '_restoreData').mockImplementation(() => { });
      jest.spyOn(child, 'setHandshakeExpiry').mockImplementation(() => { });

      child.init();

      expect(child.isSessionStorageSupported).toBe(true);
      expect(child.addListeners).toHaveBeenCalled();
      expect(child._restoreData).toHaveBeenCalled();
      expect(child.setHandshakeExpiry).toHaveBeenCalled();
    });
  });
});
