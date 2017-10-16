import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Swipeable from 'react-swipeable';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * This react component renders the message to the user
 * @class
 */
class Message extends React.Component {
  /** @constructs 
   * @param {Object} props The set of props being passed to the component
   * */
  constructor (props) {
    super(props);
    this.state = {
      left: 0,
      isActive: false,
      isDismissing: false,
      isReverting: false,
      position: null
    };
    this.swiping = (e, deltaX) => this._swiping(e, deltaX);
    this.swiped = (e, deltaX) => this._swiped(e, deltaX);
  }

  /**
   * This handler sets the position of the message card. moving the card as the user swipes. Giving the user the perception that he is moving the card.
   * @param {Object} e The event object
   * @param {number} deltaX The net movement the user has made on the xaxis
   * @returns {undefined}
   */
  _swiping(e, deltaX) {
    this.setState({
      left: (deltaX * -1),
      isActive: true
    });
  }
 
  /**
   * This handler decides the net action from the user's interaction (swipping).
   * IF the user has either flicked or moved the card more than half the distance to his right then the card is dismissed
   * Else it is brought back to it's original position
   * @param {Object} e The event object
   * @param {number} deltaX The net movement the user has made on the xaxis
   * @param {number} deltaY The net movement the user has made on the yaxis
   * @param {boolean} isFlick Did the user flick the element
   * @returns {undefined}
   */
  _swiped (e, deltaX, deltaY, isFlick) {
    if ((isFlick === true) || ((deltaX * -1) >= (this.state.position.width / 2))) {
      this.setState({
        isDismissing: true,
        isReverting: false,
        left: (this.state.position.width + 100)
      }, () => {
        setTimeout(() => {
          this.setState({
            isDismissed: true,
            isDismissing: false
          });
        }, 1000);
      });
    } else {
      this.setState({
        isDismissing: false,
        isReverting: true,
        left: 0
      }, () => {
        setTimeout(() => {
          this.setState({
            isReverting: false
          });
        }, 1000);
      });
    }
  }

  /* eslint-disable require-jsdoc */
  componentDidMount () {
    /* eslint-disable react/no-find-dom-node */
    let position = ReactDOM.findDOMNode(this.item).getBoundingClientRect();
    /* eslint-enable react/no-find-dom-node */

    this.setState({
      position
    });
  }
  /* eslint-enable require-jsdoc */

  /* eslint-disable indent, require-jsdoc */
  render () {
    let style = {
          left: `${this.state.left}px`
        },
        className= classnames('list-item', {
          'reverting': this.state.isReverting ,
          'dismissing': this.state.isDismissing,
          'dismissed': this.state.isDismissed
        });

    return (
      <Swipeable className={className}
                 onSwiping={this.swiping}
                 onSwiped={this.swiped} >
        <div className="infinite-list-item" style={style} ref={(item) => {this.item = item;}} data-messageid={this.props.id}>
          <div className="author">
            <img className="author-image" src={`http://message-list.appspot.com/${this.props.author.photoUrl}`} />
            <div className="author-details">
              <span className="author-name">{this.props.author.name}</span>
              <span className="author-last-seen-on">{moment(this.props.updated).fromNow()}</span>
            </div>
          </div>
          <div className="message">{this.props.content}</div>
        </div>
      </Swipeable>
    );
  }
  /* eslint-enable indent, require-jsdoc */
}

Message.displayName = 'Message';

Message.propTypes = {
  /**
   * The id of the message. It is not rendered visible
   */
  id: PropTypes.number,
  /**
   * The message's author details
   */
  author: PropTypes.shape({
    /**
     * The url pointing to the author's photo
     */
    photoUrl: PropTypes.string,
    /**
     * The author's name
     */
    name: PropTypes.string
  }),
  /**
   * The timestamp of the message
   */
  updated: PropTypes.string,
  /**
   * The message contents
   */
  content: PropTypes.string
};

export default Message;