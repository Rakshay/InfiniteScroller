import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Swipeable from 'react-swipeable'
import classnames from 'classnames';
// import SwipeToDelete from 'react-swipe-to-delete-component';


class ListItem extends React.Component {
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

  _swiping(e, deltaX, deltaY, absX, absY, velocity) {
    this.setState({
      left: (deltaX * -1),
      isActive: true
    });
    // console.log("You're Swiping ...", deltaX, deltaY)
  }
 
  _swiped (e, deltaX, deltaY, isFlick, velocity) {
    console.log('position', this.state.position.left);
    console.log('width', this.state.position.width);
    console.log('swipe', (deltaX * -1));
    console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity);

    if ((deltaX * -1) >= (this.state.position.width / 2)) {
      console.log('dismissed');
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
      console.log('revert');
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

  componentDidMount () {
    let position = ReactDOM.findDOMNode(this.item).getBoundingClientRect();

    this.setState({
      position
    });
  }

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
        <div className="infinite-list-item" style={style} ref={(item) => {this.item = item;}}>
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
}

export default ListItem;