import React from 'react';
import PropTypes from 'prop-types';
import Infinite from 'react-infinite';

/**
 * This react component renders the infinitely long list of messages for the user
 * @class
 */
class MessageScroller extends React.Component {
  /** @constructs 
   * @param {Object} props The set of props being passed to the component
   * */
  constructor (props) {
    super(props);

    this.handleInfiniteLoad = () => this._handleInfiniteLoad();
    this.buildElements = (start, end) => this._buildElements(start, end);

    this.state = {
      elements: this.props.buildMessages(0, 20),
      isInfiniteLoading: false
    };
  }

  /* eslint-disable require-jsdoc */
  shouldComponentUpdate (nextProps, nextState) {
    let shouldComponentUpdate = false;

    if (nextProps.containerHeight !== this.props.containerHeight) {
      shouldComponentUpdate = true;
    } else if (nextState.isInfiniteLoading !== this.state.isInfiniteLoading) {
      shouldComponentUpdate = true;
    }

    return shouldComponentUpdate;
  }
  /* eslint-enable require-jsdoc */

  /**
   * Will fetch the next batch of elements that need to be rendered
   * @returns {undefined}
   */
  _handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    }, () => {
      let elemLength = this.state.elements.length,
          newElements = this.props.buildMessages(elemLength, elemLength + 50);

      this.setState({
        isInfiniteLoading: false,
        elements: this.state.elements.concat(newElements)
      });
    });
  }

  /**
   * The item to be shown during fetching if elements dont exist
   * @returns {undefined}
   */
  elementInfiniteLoad () {
    return (
      <div className="infinite-list-item">
          Loading...
      </div>
    );
  }

  /* eslint-disable indent, require-jsdoc */
  render () {
    return (
      <Infinite elementHeight={40}
                containerHeight={this.props.containerHeight}
                infiniteLoadBeginEdgeOffset={200}
                onInfiniteLoad={this.handleInfiniteLoad}
                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                isInfiniteLoading={this.state.isInfiniteLoading} >
          {this.state.elements}
      </Infinite>
    );
  }
  /* eslint-enable require-jsdoc, indent */
}

MessageScroller.displayName = 'MessageScroller';

MessageScroller.propTypes = {
  /**
   * The callback function that returns the next batch of react elements that have to be rendered
   */
  buildMessages: PropTypes.string.isRequired,
  /**
   * The height of the parent container. This is required for it to identify the exact number of elements it can render safely.
   */
  containerHeight: PropTypes.number.isRequired
};

export default MessageScroller;