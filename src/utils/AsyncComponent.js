import React, {Component} from 'react';

import DotLoader from '../components/Loders/DotLoader/DotLoader';

export default function asyncComponent(importComponent) {
  class AsyncFunc extends Component {
    state = {
      component: null
    };

    componentWillUnmount() {
      this.mounted = false;
    }

    async componentDidMount() {
      this.mounted = true;
      const {default: Component} = await importComponent();
      if (this.mounted) {
        this.setState({
          component: <Component {...this.props} />
        });
      }
    }

    render() {
      const C = this.state.component || <DotLoader/>;
      return C;
    }
  }

  return AsyncFunc;
};
