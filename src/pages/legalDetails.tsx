import React, { FC } from 'react';
import { PageRendererProps, useStaticQuery, graphql } from 'gatsby';
import Layout from '../components/layout';
import PageTitle from '../components/pageTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobile, faEnvelope, faAt } from '@fortawesome/free-solid-svg-icons';

const LegalDetails: FC<PageRendererProps> = props => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return <PureLegalDetails {...props} site={data.site} />;
};

interface PureLegalDetailsProps extends PageRendererProps {
  site: {
    siteMetadata: {
      title: string;
    };
  };
}

export const PureLegalDetails: FC<PureLegalDetailsProps> = ({
  location,
  site,
}) => {
  const siteTitle = site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <PageTitle>Legal Details</PageTitle>
      <address>
        Roman M&uuml;hlfeldner
        <br />
        Lobmeyrgasse 5<br />
        1160 Wien
        <br />
        Phone Number: +4367761802394
        <br />
        E-Mail: contact
        <FontAwesomeIcon icon={faAt} />
        muehlfeldner.com
      </address>
      <h3>Responsible for journalistic-editorial content</h3>
      <address>
        Roman M&uuml;hlfeldner
        <br />
        Lobmeyrgasse 5<br />
        1160 Wien <br />
        E-Mail: contact
        <FontAwesomeIcon icon={faAt} />
        muehlfeldner.com
      </address>
    </Layout>
  );
};

export default LegalDetails;
