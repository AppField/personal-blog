import { graphql, PageRendererProps } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Bio from '../components/bio';
import Layout from '../components/layout';
import FadeLink from '../components/fadeLink';
import SEO from '../components/seo';
import { Query, SitePageContext } from '../graphql-types';
import { styledScale, rhythm } from '../utils/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import 'prismjs/themes/prism-okaidia.css';

interface Props extends PageRendererProps {
  pageContext: SitePageContext;
  data: Query;
}

const BlogStyles = styled.div`
  pre {
    font-size: 0.85rem;
    margin-bottom: ${rhythm(1)};
  }
`;

const BlogPostTitle = styled.h1`
  color: var(--color-primary);
`;

const Date = styled.p`
  display: block;
  ${styledScale(-1 / 5)};
  margin-bottom: ${rhythm(1)};
  margin-top: ${rhythm(-1)};
`;

const Divider = styled.hr`
  margin-bottom: ${rhythm(1)};
  background-color: var(--color-primary);
`;

const PostNavigator = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
`;

const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;

const BlogPostTemplate = (props: Props) => {
  const data = props.data!;
  const post = data.markdownRemark!;
  const excerpt = post.excerpt!;
  const frontmatter = post.frontmatter!;
  const html = post.html!;
  const siteTitle = data.site!.siteMetadata!.title!;
  const { previous, next } = props.pageContext;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title={frontmatter.title!}
        description={frontmatter.description || excerpt}
      />
      <BlogPostTitle>{post.frontmatter!.title}</BlogPostTitle>
      <Date>
        <em>{frontmatter.date}</em>
      </Date>
      <BlogStyles dangerouslySetInnerHTML={{ __html: html }} />

      <Divider />
      <Bio />
      <PostNavigator>
        <li>
          {previous && (
            <FadeLink to={previous.fields!.slug!} rel="prev">
              <FontAwesomeIcon icon={faArrowLeft} />{' '}
              {previous.frontmatter!.title}
            </FadeLink>
          )}
        </li>
        <li>
          {next && (
            <FadeLink to={next.fields!.slug!} rel="next">
              {next.frontmatter!.title} <FontAwesomeIcon icon={faArrowRight} />
            </FadeLink>
          )}
        </li>
      </PostNavigator>
    </Layout>
  );
};

export default BlogPostTemplate;
export { pageQuery };
