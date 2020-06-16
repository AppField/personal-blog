import { PageRendererProps, PageProps, Link } from 'gatsby';
import React, { ReactNode, FC } from 'react';
import styled from 'styled-components';

import ThemeToggle from './themeToggle';
import { rhythm, styledScale } from '../utils/typography';

interface LayoutProps extends PageRendererProps {
  title: string;
  children: ReactNode;
}

const StyledH1 = styled.h1`
  margin-bottom: ${rhythm(1.5)};
  margin-top: 0;
`;

const StyledH3 = styled.h3`
  ${styledScale(1.5)};
  font-family: Montserrat, sans-serif;
  margin-top: 0;
`;

const StyledLink = styled(Link)`
  box-shadow: none;
  color: inherit;
  text-decoration: none;
  font-size: 2.5rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(28)};
  padding: ${`${rhythm(1.5)} ${rhythm(3 / 4)}`};

  main {
    flex: 1;
  }
`;

const StyledFooter = styled.footer`
  font-size: ${rhythm(0.9 / 2)};
`;

const Layout: FC<LayoutProps> = (props: LayoutProps) => {
  const { location, title, children } = props;
  const rootPath = `/`;

  // const HeaderTitle = location.pathname === rootPath ? StyledH1 : StyledH3;

  return (
    <Content>
      <header>
        <StyledH1>
          <StyledLink to={`/`}>{title}</StyledLink>
        </StyledH1>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <StyledFooter>
        © {new Date().getFullYear()}{' '}
        <Link to="/legalDetails">Legal Details</Link>, Built with
        {` `}
        <a href="https://www.gatsbyjs.org" rel="noreferrer" target="__blank">
          Gatsby
        </a>
      </StyledFooter>
    </Content>
  );
};

export default Layout;
