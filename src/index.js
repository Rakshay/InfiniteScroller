'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import classnames from 'classnames';
import InfiniteList from './infinite';

const fetchMessage = (pageToken) => {
  return axios({
    url:'http://message-list.appspot.com/messages',
    params: {
      pageToken,
      limit: 100
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
      messages: [],
      containerHeight: '10'
    };

    this.getMessage = (messageIndex) => this._getMessage(messageIndex);
  }

  componentDidMount () {
    let messages = [],
        containerHeight = ReactDOM.findDOMNode(this.container).offsetHeight;

    fetchMessage(this.state.pageToken)
      .then((response) => {
        messages = response.data.messages;

        if (response.data.pageToken !== undefined) {
          fetchMessage(response.data.pageToken)
            .then((response) => {
              
              if (response.data.pageToken !== undefined) {
                messages = mergeMessages(messages, response.data.messages);

                fetchMessage(response.data.pageToken)
                  .then((response) => {
                    this.setState({
                      messages: mergeMessages(messages, response.data.messages),
                      pageToken: response.data.pageToken,
                      containerHeight
                    });
                  });
              } else {
                this.setState({
                  messages: mergeMessages(messages, response.data.messages),
                  containerHeight
                });
              }
            });
        } else {
          this.setState({
            messages,
            containerHeight
          });
        }
      });
  }

  getMessages () {
    if (this.state.fetchingMessages !== true) {
      this.setState({
        fetchingMessages: true
      }, () => {
        fetchMessage(this.state.pageToken)
          .then((response) => {
            this.setState({
              messages: mergeMessages(this.state.messages, response.data.messages),
              pageToken: response.data.pageToken,
              fetchingMessages: false
            });
          });
      });
    }
  }

  _getMessage (messageIndex) {
    if (messageIndex > (this.state.messages.length - 250)) {
      this.getMessages();
    }

    return this.state.messages[messageIndex];
  }

  render () {
    let className = classnames('infinite-message-list', 'fill-height');

    return (
      <div className={className} ref={(container) => {this.container = container;}}>
        {
          (() => {
            if (this.state.messages.length > 0) {
              return <InfiniteList containerHeight={this.state.containerHeight} getMessage={this.getMessage} />;
            }
          })()
        }
      </div>
    );
  }
}

InfiniteScroller.displayName = 'InfiniteScroller';

export default InfiniteScroller;
