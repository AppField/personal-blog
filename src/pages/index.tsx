import { graphql, PageRendererProps, useStaticQuery } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Bio from '../components/bio';
import Layout from '../components/layout';
import FadeLink from '../components/fadeLink';
import SEO from '../components/seo';
import { MarkdownRemark } from '../graphql-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { rhythm } from '../utils/typography';

const StyledLink = styled(FadeLink)`
  box-shadow: none;
  text-decoration: none;
`;

const PageTitle = styled.h2`
  margin-bottom: 3rem;
`;

const BlogCard = styled.div`
  margin-bottom: 3.5rem;
  color: var(--color-text);

  h3 {
    margin-bottom: ${rhythm(1 / 4)};
    color: var(--color-primary);
  }
  p {
    margin-top: ${rhythm(1 / 4)};
  }
  .blog-arrow {
    margin-left: ${rhythm(1 / 2)};
    opacity: 0;
    transition: opacity 300ms ease, transform 300ms ease;
  }
  &:hover .blog-arrow {
    opacity: 1;
    transform: translate3d(15px, 0, 0);
  }
`;

type Props = PageRendererProps;

const BlogIndex = (props: Props) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
              description
            }
          }
        }
      }
    }
  `);

  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />
      <Bio />

      <PageTitle>Blog Posts</PageTitle>
      {posts.map(({ node }: { node: MarkdownRemark }) => {
        const frontmatter = node!.frontmatter!;
        const fields = node!.fields!;
        const slug = fields.slug!;
        const excerpt = node!.excerpt!;

        const title = frontmatter.title || fields.slug;
        return (
          <StyledLink to={slug} key={slug}>
            <BlogCard>
              <h3>
                {title}
                <FontAwesomeIcon className="blog-arrow" icon={faArrowRight} />
              </h3>
              <small>
                <em>{frontmatter.date}</em>
              </small>
              <p
                dangerouslySetInnerHTML={{
                  __html: frontmatter.description || excerpt,
                }}
              />
            </BlogCard>
          </StyledLink>
        );
      })}
    </Layout>
  );
};

export default BlogIndex;
