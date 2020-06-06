import { PageRendererProps, PageProps } from 'gatsby';
import React, { ReactNode, FC } from 'react';
import styled from 'styled-components';

import FadeLink from './fadeLink';
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

const StyledLink = styled(FadeLink)`
  box-shadow: none;
  color: inherit;
  text-decoration: none;
  font-size: 2.5rem;
`;

const Content = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: ${rhythm(28)};
  padding: ${`${rhythm(1.5)} ${rhythm(3 / 4)}`};
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
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org" rel="noreferrer">
          Gatsby
        </a>
      </footer>
    </Content>
  );
};

export default Layout;
