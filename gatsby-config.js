module.exports = {
  siteMetadata: {
    title: `Blog by RMuhlfeldner`,
    description: `A starter blog demonstrating what Gatsby can do.`,
    author: {
      name: `Roman Mühlfeldner`,
      summary: `who lives and works in Vienna.`,
    },
    siteUrl: `https://gatsby-starter-blog-demo.netlify.app/`,
    social: {
      twitter: `rmuhlfeldner`,
      linkedin: `in/roman-mühlfeldner`,
      xing: `profile/Roman_Muehlfeldner`,
      github: `AppField`,
      dev: `rmuehlfeldner`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `RMuhlfeldner Blog`,
        short_name: `RMuhlfeldner`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ae2a59`,
        display: `minimal-ui`,
        icon: `content/assets/rm-icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-transition-link`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    // {
    //   resolve: `gatsby-plugin-graphql-codegen`,
    //   options: {
    //     fileName: "./src/graphql-types.ts",
    //   },
    // },
    // `gatsby-plugin-feed`,
  ],
};
