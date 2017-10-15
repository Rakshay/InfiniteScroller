/*global document*/
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroller from '../src';

(() => {
  let messageListContainer = document.getElementById('message-list');

  ReactDOM.render(React.createElement(InfiniteScroller), messageListContainer);
})();
