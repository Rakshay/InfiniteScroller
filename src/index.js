'use strict';

import React from 'react';
import axios from 'axios';

const fetchMessage = (pageToken) => {
  return axios({
    url:'http://message-list.appspot.com/messages',
    params: {
      pageToken,
      limit: 50
    }
  });
};

const mergeMessages = (currentMessages, newMessages) => {
  return currentMessages.concat(newMessages);
};

class InfiniteScroller extends React.Component {
  constructor () {
    super();

    this.state = {
      pageToken: undefined,
      messages: []
    };
  }

  componentDidMount () {
    let messages = [];

    fetchMessage(this.state.pageToken)
      .then((response) => {
        messages = response.data.messages;

        if (response.data.pageToken !== undefined) {
          fetchMessage(response.data.pageToken)
            .then((response) => {
              this.setState({
                messages: mergeMessages(messages, response.data.messages),
                pageToken: response.data.pageToken
              });
            });
        } else {
          this.setState({
            messages
          });
        }
      });
  }

  getMessages () {
    fetchMessage(this.state.pageToken)
      .then((response) => {
        this.setState({
          messages: mergeMessages(this.state.messages, response.data.messages),
          pageToken: response.data.pageToken
        });
      });
  }

  render () {
    return (
      <div>
        Component
      </div>
    );
  }
}

InfiniteScroller.displayName = 'InfiniteScroller';

export default InfiniteScroller;
