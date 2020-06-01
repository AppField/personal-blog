/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import React, { ComponentProps, forwardRef, Ref } from 'react';
import styled from 'styled-components';
import { rhythm } from '../utils/typography';
import {
  faTwitter,
  faLinkedin,
  faGithub,
  faXing,
  faDev,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Content = styled.div`
  display: flex;
  margin-bottom: ${rhythm(2.5)};
`;

const GatsbyImage = forwardRef(
  (props: ComponentProps<typeof Image>, ref: Ref<Image>) => (
    <Image {...props} ref={ref} />
  )
);

const Avatar = styled(GatsbyImage)`
  border-radius: 100%;
  margin-bottom: 0;
  margin-right: ${rhythm(1 / 2)};
  min-width: 50px;
  border: 2px solid var(--color-primary);
`;

const Social = styled.a`
  margin: 0 ${rhythm(1 / 4)};
  text-decoration: none !important;
`;

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
          }
          social {
            twitter
            linkedin
            xing
            github
            dev
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;

  return (
    <Content>
      <Avatar
        fixed={data.avatar.childImageSharp.fixed}
        alt={author.name}
        imgStyle={{ borderRadius: '50%' }}
      />
      <p>
        My name is <strong>{author.name}</strong>. I live and work in Vienna as
        a Frontend developer with an ongoing study in Business Informatics.
        {` `}
        <br />{' '}
        <Social
          href={`https://twitter.com/${social.twitter}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Find me on Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </Social>
        <Social
          href={`https://linkedin.com/${social.linkedin}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Find me on Linked In"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </Social>
        <Social
          href={`https://xing.com/${social.xing}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Find me on Xing"
        >
          <FontAwesomeIcon icon={faXing} />
        </Social>
        <Social
          href={`https://github.com/${social.github}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Find me on GitHub"
        >
          <FontAwesomeIcon icon={faGithub} />
        </Social>
        <Social
          href={`https://dev.to/${social.dev}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Find me on DEV"
        >
          <FontAwesomeIcon icon={faDev} />
        </Social>
      </p>
    </Content>
  );
};

export default Bio;
