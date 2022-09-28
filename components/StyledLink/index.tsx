import Link from 'next/link'
import { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

interface Props {
    as?: string;
    href: string;
    className?: string;
}

const StyledLink: FC<PropsWithChildren<any>> = ({ as, children, className, href }) => (
  <Link href={href} as={as} passHref>
    <a className={className}>{children}</a>
  </Link>
)

export default styled(StyledLink)`
    display: flex;
    width: 80%;
    height: 20px;
    text-decoration: none;
    color: ${props => props.theme.colors.secondary};

    &:hover {
        color: ${props => props.theme.colors.highlight};
    }

    &:focus {
        color: ${props => props.theme.colors.highlight};
        outline: none;
        border: 0;
    }
`