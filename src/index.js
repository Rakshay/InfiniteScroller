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

const fetchMessages = (messageCount, currentPageToken) => {
  return new Promise((resolve, reject) => {
    fetchMessage(currentPageToken)
      .then((response) => {
        let messages = response.data.messages,
            pageToken = response.data.pageToken;
        
        if (messageCount > 100) {
          fetchMessages((messageCount - 100), pageToken)
            .then((messagesReponse) => {
              messages = mergeMessages(messages, messagesReponse.messages);
              resolve({
                messages,
                pageToken: messagesReponse.pageToken
              });
            });
        } else {
          resolve({
            messages,
            pageToken
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
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
    let containerHeight = ReactDOM.findDOMNode(this.container).offsetHeight;

    fetchMessages(800)
      .then((messagesReponse) => {
        this.setState({
          messages: messagesReponse.messages,
          pageToken: messagesReponse.pageToken,
          containerHeight
        });  
      });
  }

  getMessages () {
    if (this.state.fetchingMessages !== true) {
      this.setState({
        fetchingMessages: true
      }, () => {
        fetchMessages(300, this.state.pageToken)
          .then((messagesReponse) => {
            this.setState({
              messages: mergeMessages(this.state.messages, messagesReponse.messages),
              pageToken: messagesReponse.pageToken,
              fetchingMessages: false
            });  
          });
      });
    }
  }

  _getMessage (messageIndex) {
    let message,
        messageCount = this.state.messages.length;

    if (messageIndex % 200 === 0) {
      this.getMessages(messageIndex);
    }

    if (messageIndex < messageCount) {
      message = this.state.messages[messageIndex];
    } else {
      message = this.state.messages[messageCount - 1];
    }

    return message;
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
