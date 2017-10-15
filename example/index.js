/*global document*/
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroller from '../src';

(() => {
  ReactDOM.render(React.createElement(InfiniteScroller), document.getElementById('message-list'));
})();
