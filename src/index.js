'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import classnames from 'classnames';
import InfiniteList from './messageScroller';
import Message from './message.js';

/**
 * This react component will fetch the messages from the api (url must be passed as a prop) and renders it for the user
 * @class
 */
class MessagesViewer extends React.Component {
  /** @constructs */
  constructor () {
    super();

    this.state = {
      pageToken: undefined,
      messages: [],
      containerHeight: '10'
    };

    this.fetchMessage = (pageToken) => this._fetchMessage(pageToken);
    this.mergeMessages = (currentMessages, newMessages) => this._mergeMessages(currentMessages, newMessages);
    this.fetchMessages = (messageCount, currentPageToken) => this._fetchMessages(messageCount, currentPageToken);
    this.getMessage = (messageIndex) => this._getMessage(messageIndex);
    this.buildMessages = (start, end) => this._buildMessages(start, end);
    this.getMessages = () => this._getMessages();
  }

  /**
   * Fetches the stream of messages to be rendered (if provided a page Token will fetch the specific page of data)
   * @param {string} [pageToken] Optional pageToken 
   * @returns {undefined}
   */
  _fetchMessage (pageToken) {
    return axios({
      url: this.props.apiEndPoint,
      params: {
        pageToken,
        limit: 100
      }
    });
  }

  /**
   * 
   * @param {Array.Object} currentMessages Array of messages currently held
   * @param {Array.Object} newMessages New Array of messages that have to be merged
   * @returns {Array.Object} New Array which is combination of currentMessages and newMessages
   */
  _mergeMessages (currentMessages, newMessages) {
    return currentMessages.concat(newMessages);
  }

  /**
   * A recursive function that will fetch the number of messages required
   * @param {number} messageCount Total number of messages required
   * @param {string} [currentPageToken] Optional pageToken
   * @returns {Promise} Promise object that returns the messages fetched along with a pageToken (if any)
   */
  _fetchMessages (messageCount, currentPageToken) {
    return new Promise((resolve, reject) => {
      this.fetchMessage(currentPageToken)
        .then((response) => {
          let messages = response.data.messages,
              pageToken = response.data.pageToken;
          
          if (messageCount > 100) {
            this.fetchMessages((messageCount - 100), pageToken)
              .then((messagesReponse) => {
                messages = this.mergeMessages(messages, messagesReponse.messages);
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
  }

  /* eslint-disable require-jsdoc */
  componentDidMount () {
    /* eslint-disable react/no-find-dom-node */
    let containerHeight = ReactDOM.findDOMNode(this.container).offsetHeight;
    /* eslint-enable react/no-find-dom-node */

    this.fetchMessages(800)
      .then((messagesReponse) => {
        this.setState({
          messages: messagesReponse.messages,
          pageToken: messagesReponse.pageToken,
          containerHeight
        });  
      });
  }
  /* eslint-enable require-jsdoc */

  /**
   * Fetches the next batch of messages to be cached for later rendering
   * @returns {undefined}
   */
  _getMessages () {
    if (this.state.fetchingMessages !== true) {
      this.setState({
        fetchingMessages: true
      }, () => {
        this.fetchMessages(100, this.state.pageToken)
          .then((messagesReponse) => {
            this.setState({
              messages: this.mergeMessages(this.state.messages, messagesReponse.messages),
              pageToken: messagesReponse.pageToken,
              fetchingMessages: false
            });  
          });
      });
    }
  }

  /**
   * Fetches the next batch of messages to be rendered
   * @param {number} start The start index, co-relates to a message's index in the list of messages
   * @param {number} end  The end index, co-relates to a message's index in the list of messages
   * @returns {Array.Object} An array of Message elements(React elements) to be rendered
   */
  _buildMessages (start, end) {
    let elements = [],
        messageCount = this.state.messages.length;

    if ((messageCount - end) < 600) {
      this.getMessages();
    }

    for (let i = start; i < end; i++) {
      let message = this.state.messages[i];
      elements.push(<Message key={i} {...message} />);
    }

    return elements;
  }

  /* eslint-disable require-jsdoc */
  render () {
    let className = classnames('infinite-message-list', 'fill-height');

    /* eslint-disable indent */
    return (
      <div className={className} ref={(container) => {this.container = container;}}>
        {
          (() => {
            if (this.state.messages.length > 0) {
              return <InfiniteList containerHeight={this.state.containerHeight}
                                   getMessage={this.getMessage}
                                   buildMessages={this.buildMessages} />;
            } else {
              return <div className="loading-indicator" />;
            }
          })()
        }
      </div>
    );
  }
  /* eslint-enable require-jsdoc */
}

MessagesViewer.displayName = 'InfiniteScroller';

MessagesViewer.propTypes = {
  /**
   * The api base url which feeds the messsages
   */
  apiEndPoint: PropTypes.string.isRequired
};

export default MessagesViewer;
