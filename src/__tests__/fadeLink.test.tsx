import React from 'react';
import renderer from 'react-test-renderer';
import InternalProvider from 'gatsby-plugin-transition-link/context/InternalProvider';

import FadeLink from '../components/fadeLink';

describe('<FadeLink/>', () => {
  it('renders correctly', () => {
    global.window.matchMedia = jest.fn().mockImplementation(() => true);

    const tree = renderer
      .create(
        <InternalProvider>
          <FadeLink to="/blog" />
        </InternalProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
