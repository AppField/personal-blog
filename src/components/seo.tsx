/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from 'gatsby';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

export interface Meta {
  name: string;
  content: string;
}

export interface MetaProps {
  title: string;
  lang?: string;
  meta?: Meta[];
  keywords?: string[];
  description?: string;
}

const SEO = (props: MetaProps) => {
  const data = useStaticQuery<PureSEOProps>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              name
            }
          }
        }
      }
    `
  );

  return <PureSEO {...props} site={data.site} />;
};

export interface PureSEOProps {
  site: {
    siteMetadata: {
      title: string;
      description: string;
      author: {
        name: string;
      };
    };
  };
}

export const PureSEO: FC<PureSEOProps & MetaProps> = props => {
  const lang = props.lang || 'en';
  const meta = props.meta || [];
  const keywords = props.keywords || [];
  const description = props.description || '';

  const metaDescription = description || props.site.siteMetadata.description;
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={props.title}
      titleTemplate={`%s | ${props.site.siteMetadata.title}`}
      meta={[
        {
          content: metaDescription,
          name: `description`,
        },
        {
          content: props.title,
          property: `og:title`,
        },
        {
          content: metaDescription,
          property: `og:description`,
        },
        {
          content: `website`,
          property: `og:type`,
        },
        {
          content: `summary`,
          name: `twitter:card`,
        },
        {
          content: props.site.siteMetadata.author.name,
          name: `twitter:creator`,
        },
        {
          content: props.title,
          name: `twitter:title`,
        },
        {
          content: metaDescription,
          name: `twitter:description`,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                content: keywords.join(`, `),
                name: `keywords`,
              }
            : []
        )
        .concat(meta)}
    />
  );
};

export default SEO;
