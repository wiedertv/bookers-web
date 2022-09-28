import Image from 'next/image'
import Link from 'next/link'
import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { device } from '../../utils/devices'
import { AuthenticationButton } from '../AuthenticationButton'
import { Burger } from '../Burger'



const MenuContainer = styled.nav`
    width: 100%;
    height: 70px;
    margin: 0;
    display: grid;
    justify-content: space-around;
    align-items: center;
    column-gap: 1%;
    grid-template-areas: "Logo Menu Menu Button";
    grid-template-columns: auto auto auto auto ;
    @media ${device.mobileXS} {
        
        grid-template-columns: auto auto ;
        grid-template-areas: "Logo Burger";
        justify-content: center;
        margin: 0;
        padding: 0 10vw;

    }
    @media ${device.laptop} {
    
        grid-template-areas: "Logo Menu Menu Button";
        grid-template-columns: auto auto auto auto ;
        justify-content: space-around;
        padding: 0 2vw;
        
    }
    
    @media ${device.desktop} {
    
        grid-template-areas: "Logo Menu Menu Button";
        grid-template-columns: auto auto auto auto ;
        justify-content: space-around;
        padding:0;
        
    }
    
`

const Logo = styled.div`

    display: block;
    position: relative;
    width: 150px;
    height: 80px;
    justify-content: center;
    align-items: center;
    grid-area: Logo;
    &:hover {
        cursor: pointer;
    }

`

const LinksWrapper = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    grid-area: Menu;
    @media ${device.mobileXS} {
        display: none;
    }
    @media ${device.laptop} {
        display: flex; 
    }
    
    @media ${device.desktop} {
        display: flex;
    }
    a:not(:last-child) { border-right: 1px solid black; }

    a{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 20px;
        text-decoration: none;
        color: ${props => props.theme.colors.primary};
    
        &:hover {
            color: ${props => props.theme.colors.highlight};
        }
    
        &:focus {
            color: ${props => props.theme.colors.highlight};
            outline: none;
        }
    }
`

const ButtonWrapper = styled.div`

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    grid-area: Button;

`

const BurgerWrapper = styled.div<{open:boolean}>`
    grid-area: Burger;
    @media ${device.mobileXS} {
        display: flex;
        width: 20vw;
        justify-content:end;
    }
    @media ${device.tablet} {
        display: flex;
        width: 50vw;
        justify-content:end;
    }
    @media ${device.laptop} {
        display: none; 
    }
    
    @media ${device.desktop} {
        display: none;
    }
`

export const StyledMenu = styled.nav<{open:boolean}>`

    display: flex;
    z-index: 20;
    flex-direction: column;
    justify-content: center;
    background: ${({ theme }) => theme.backgrounds.primary};
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    position: ${({ open }) => open ? 'fixed' : 'absolute'};
    height: 100vh;
    text-align: left;
    padding: 2rem;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
  
    @media ${device.mobileXS} {
        width: 100%;
    }
    @media ${device.laptop} {
       display: none;
    }

    a {
        font-size: 2rem;
        text-transform: uppercase;
        padding: 2rem 0;
        font-weight: bold;
        letter-spacing: 0.5rem;
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;
        transition: color 0.3s linear;
        
        @media ${device.mobileXS} {
            font-size: 1.5rem;
            text-align: center;
        }

        &:hover {
            color: ${({ theme }) => theme.colors.highlight};
        }
    }
    div{
        display: flex;
        width: 100%;
        margin: 0 auto;
        justify-content:center;
    }
`;



export const Menu = () => {
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react/display-name
    const LogoImage = forwardRef((props, ref) => (
        // @ts-ignore
        <div ref={ref}>
            <Image src="/logo.png"  alt='bookers logo' layout='fill' objectFit="contain" {...props} />
        </div>
    ));

    return (
    <MenuContainer>
        <Logo>
            <Link href="/" passHref>
                <LogoImage />
            </Link>
        </Logo>
        <LinksWrapper> 
            <a href="https://bookers.club/#comunidad-bookers" target={'_blank'} rel="noopener noreferrer"  >
                Comunidad
            </a>
            <a href="https://bookers.club/#road-map" target={'_blank'} rel="noopener noreferrer" >
                Road Map
            </a>
            <a href="https://store.bookers.club/" target={'_blank'} rel="noopener noreferrer" >
                Bookers Store
            </a>
            <a href="https://bookers.club/#preguntas-frecuentes" target={'_blank'} rel="noopener noreferrer" >
                FAQs
            </a>
        </LinksWrapper>
        <ButtonWrapper>
            <AuthenticationButton mobile={false} />
        </ButtonWrapper>
        <BurgerWrapper open={open}>
           <Burger open={open} setOpen={setOpen} />
        </BurgerWrapper>
        <StyledMenu open={open}>
            <div>
                <AuthenticationButton mobile={true} />
            </div>
            <a href="https://bookers.club/#comunidad-bookers" target={'_blank'} rel="noopener noreferrer"  >
                Comunidad
            </a>
            <a href="https://bookers.club/#road-map" target={'_blank'} rel="noopener noreferrer" >
                Road Map
            </a>
            <a href="https://store.bookers.club/" target={'_blank'} rel="noopener noreferrer" >
                Bookers Store
            </a>
            <a href="https://bookers.club/#preguntas-frecuentes" target={'_blank'} rel="noopener noreferrer" >
                FAQs
            </a>
        </StyledMenu>
    </MenuContainer>
  )
}
