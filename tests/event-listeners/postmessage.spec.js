/**
 * @jest-environment jsdom
 */

import tabUtils from '../../src/utils/tab';
import arrayUtils from '../../src/utils/array';
import WarningTextEnum from '../../src/enums/WarningTextEnum';
import PostMessageEventNamesEnum from '../../src/enums/PostMessageEventNamesEnum';

import PostMessageListener from '../../src/event-listeners/postmessage';

function beforeEveryEach() {
  tabUtils.tabs = [];
  tabUtils.config = {
    parse: JSON.parse,
    stringify: JSON.stringify
  };
  setNewTabInfo();
}
function afterEveryEach() {
  // teardown
  unSetNewTabInfo();
}

function setNewTabInfo() {
  window.newlyTabOpened = {
    id: 'c88347f9-6600-4575-b4ab-18c33e0c2151',
    name: 'testing@123',
    ref: window
  };
}
function unSetNewTabInfo() {
  window.newlyTabOpened = {};
}

describe('PostMessageListener', () => {
  beforeEach(() => {
    beforeEveryEach();
  });
  afterEach(() => {
    afterEveryEach();
  });

  describe('Basic tests', () => {
    it('verify it is defined and its methods', () => {
      expect(PostMessageListener).toBeDefined();
      expect(PostMessageListener._onLoad).toBeDefined();
      expect(PostMessageListener._onCustomMessage).toBeDefined();
      expect(PostMessageListener._onBeforeUnload).toBeDefined();
      expect(PostMessageListener.onNewTab).toBeDefined();
    });
  });
  describe('PostMessageListener:_onLoad', () => {
    it('should set newlyTabOpened info on window load', () => {
      unSetNewTabInfo();
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });

      expect(window.newlyTabOpened.id).not.toBeDefined();
      expect(window.newlyTabOpened.name).not.toBeDefined();

      PostMessageListener._onLoad(
        PostMessageEventNamesEnum.LOADED + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' })
      );

      expect(window.newlyTabOpened.id).toBeDefined();
      expect(window.newlyTabOpened.name).not.toBeDefined();
    });
    it('should send a msg to child', () => {
      let spy = jest.fn();

      // postMessage runs asynchronously, verify after the message has been posted and after the event has been fired off.
      window.addEventListener('message', e => {
        spy();
      });
      jest.spyOn(tabUtils, 'sendMessage').mockImplementation(() => { });
      PostMessageListener._onLoad(
        PostMessageEventNamesEnum.LOADED + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' })
      );
      expect(tabUtils.sendMessage).toHaveBeenCalled();
    });
  });
  describe('PostMessageListener:_onCustomMessage', () => {
    it('should verify that correct event has been dispatched on receiving data', () => {
      unSetNewTabInfo();
      let eventDetailData = {
        key: 'value'
      },
        data = PostMessageEventNamesEnum.HANDSHAKE + JSON.stringify(eventDetailData),
        eventSpy = jest.fn();

      window.addEventListener('onCustomChildMessage', eventSpy);
      PostMessageListener._onCustomMessage(data, PostMessageEventNamesEnum.HANDSHAKE);

      expect(eventSpy).toHaveBeenCalled();
    });
  });
  describe('PostMessageListener:_onBeforeUnload', () => {
    it('should not reassign newlyTabOpened if no tab is currently opened', () => {
      let data =
        PostMessageEventNamesEnum.ON_BEFORE_UNLOAD + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });

      jest.spyOn(arrayUtils, 'searchByKeyName').mockImplementation(() => { });
      PostMessageListener._onBeforeUnload(data);
      expect(arrayUtils.searchByKeyName).not.toHaveBeenCalled();
    });
    it('should reassign newlyTabOpened to the tab just opened', () => {
      let data =
        PostMessageEventNamesEnum.ON_BEFORE_UNLOAD + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });

      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });

      jest.spyOn(arrayUtils, 'searchByKeyName').mockImplementation(() => { });
      PostMessageListener._onBeforeUnload(data);
      expect(arrayUtils.searchByKeyName).toHaveBeenCalled();
    });
  });
  describe('PostMessageListener:onNewTab', () => {
    it('should not proceed to process postmessage if no opened tabs', () => {
      let message = {
        data: PostMessageEventNamesEnum.LOADED
      };

      expect(PostMessageListener.onNewTab(message)).toBe(false);
    });
    it('should not proceed to process postmessage if origin doesnt match', () => {
      let message = {
        data: PostMessageEventNamesEnum.LOADED,
        origin: 'abc.com'
      };

      tabUtils.config = { origin: 'xyz.com' };
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });
      expect(PostMessageListener.onNewTab(message)).toBe(false);
    });
    it('should invoke _onLoad method on receiving LOADED from child tab', () => {
      let message = {
        data: PostMessageEventNamesEnum.LOADED
      };

      jest.spyOn(PostMessageListener, '_onLoad').mockImplementation(() => { });
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });
      PostMessageListener.onNewTab(message);

      expect(PostMessageListener._onLoad).toHaveBeenCalledWith(message.data);
    });
    it('should invoke _onCustomMessage method on receiving CUSTOM from child tab', () => {
      let message = {
        data: PostMessageEventNamesEnum.CUSTOM + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' })
      };

      jest.spyOn(PostMessageListener, '_onCustomMessage').mockImplementation(() => { });
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });
      PostMessageListener.onNewTab(message);

      expect(PostMessageListener._onCustomMessage).toHaveBeenCalledWith(message.data, PostMessageEventNamesEnum.CUSTOM);
    });
    it('should invoke _onCustomMessage method on receiving HANDSHAKE from child tab', () => {
      let message = {
        data: PostMessageEventNamesEnum.HANDSHAKE + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' })
      };

      jest.spyOn(PostMessageListener, '_onCustomMessage').mockImplementation(() => { });
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });
      PostMessageListener.onNewTab(message);

      expect(PostMessageListener._onCustomMessage).toHaveBeenCalledWith(
        message.data,
        PostMessageEventNamesEnum.HANDSHAKE
      );
    });
    it('should invoke _onBeforeUnload method on receiving ON_BEFORE_UNLOAD from child tab', () => {
      let message = {
        data:
          PostMessageEventNamesEnum.ON_BEFORE_UNLOAD + JSON.stringify({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' })
      };

      jest.spyOn(PostMessageListener, '_onBeforeUnload').mockImplementation(() => { });
      tabUtils.tabs.push({ id: 'c88347f9-6600-4575-b4ab-18c33e0c2151' });
      PostMessageListener.onNewTab(message);

      expect(PostMessageListener._onBeforeUnload).toHaveBeenCalledWith(message.data);
    });
  });
});
