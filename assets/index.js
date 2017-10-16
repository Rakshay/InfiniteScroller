/*global document*/
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import MessagesViewer from '../src';

(() => {
  let messageListContainer = document.getElementById('message-list');

  ReactDOM.render(React.createElement(MessagesViewer, {apiEndPoint: 'http://message-list.appspot.com/messages'}), messageListContainer);
})();
