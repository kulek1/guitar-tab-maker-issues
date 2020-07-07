import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
const appRoot: HTMLElement = document.getElementById('root');

export default class TabPreview extends React.Component {
  el: HTMLDivElement;

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    this.el.id = 'tab-preview';
  }

  componentDidMount(): void {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    appRoot.appendChild(this.el);
  }

  componentWillUnmount(): void {
    appRoot.removeChild(this.el);
  }

  render(): React.ReactPortal {
    const { children } = this.props;
    return ReactDOM.createPortal(children, this.el);
  }
}
