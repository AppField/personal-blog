import React from 'react';
import renderer from 'react-test-renderer';

import { PureBioProps, PureBio } from '../src/components/bio';
import { FixedObject } from 'gatsby-image';

describe('<Bio/>', () => {
  it('renders correctly', () => {
    const data = {
      avatar: {
        childImageSharp: {
          fixed: {
            width: 50,
            height: 50,
            src: 'avatar.png',
            srcSet: 'avatar.png',
          } as FixedObject,
        },
      },
      site: {
        siteMetadata: {
          author: {
            name: 'author name',
          },
          social: {
            twitter: 'twitter',
            linkedin: 'linkedin',
            xing: 'xing',
            github: 'github',
          },
        },
      },
    } as PureBioProps;

    const tree = renderer
      .create(<PureBio avatar={data.avatar} site={data.site} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
