import React from 'react';
// import SwipeToDelete from 'react-swipe-to-delete-component';


class ListItem extends React.Component {
  render () {
    return (
      <div className="infinite-list-item">
        <span className="list-group-item-heading">{this.props.content}</span>
      </div>
    );
  }
}

export default ListItem;