import ListItem from './item.js';
import React from 'react';
import Infinite from 'react-infinite';

class InfiniteList extends React.Component {
  constructor (props) {
    super(props);

    this.handleInfiniteLoad = () => this._handleInfiniteLoad();
    this.buildElements = (start, end) => this._buildElements(start, end);

    this.state = {
      elements: this.buildElements(0, 20),
      isInfiniteLoading: false
    };
  }


  _buildElements (start, end) {
    let elements = [];

    for (let i = start; i < end; i++) {
      let message = this.props.getMessage(i);
      elements.push(<ListItem key={i} {...message} messageId={i} />);
    }
    return elements;
  }

  _handleInfiniteLoad () {
    this.setState({
      isInfiniteLoading: true
    }, () => {
      let elemLength = this.state.elements.length,
          newElements = this.buildElements(elemLength, elemLength + 100);

      this.setState({
        isInfiniteLoading: false,
        elements: this.state.elements.concat(newElements)
      });
    });
  }

  elementInfiniteLoad () {
    return (
      <div className="infinite-list-item">
          Loading...
      </div>
    );
  }

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
}

// var InfiniteList = React.createClass({
//   getInitialState: function() {
//     return {
//         elements: this.buildElements(0, 20),
//         isInfiniteLoading: false
//     }
//   },

//     buildElements: function(start, end) {
//         var elements = [];
//         for (var i = start; i < end; i++) {
//             elements.push(<ListItem key={i} num={i}/>)
//         }
//         return elements;
//     },

//     handleInfiniteLoad: function() {
//         var that = this;
//         this.setState({
//             isInfiniteLoading: true
//         });
//         setTimeout(function() {
//             var elemLength = that.state.elements.length,
//                 newElements = that.buildElements(elemLength, elemLength + 100);
//             that.setState({
//                 isInfiniteLoading: false,
//                 elements: that.state.elements.concat(newElements)
//             });
//         }, 2500);
//     },

//     elementInfiniteLoad: function() {
//         return <div className="infinite-list-item">
//             Loading...
//         </div>;
//     },

//     render: function() {
//         return <Infinite elementHeight={40}
//                         containerHeight={250}
//                         infiniteLoadBeginEdgeOffset={200}
//                         onInfiniteLoad={this.handleInfiniteLoad}
//                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
//                         isInfiniteLoading={this.state.isInfiniteLoading}
//                         >
//             {this.state.elements}
//         </Infinite>;
//     }
// });

export default InfiniteList;