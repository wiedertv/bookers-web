import { FC, PropsWithChildren } from "react"
import Head from "next/head"
import { Menu } from "../components/Menu"
import styled from "styled-components"
import { device } from "../utils/devices"

interface Props {
    title?: string
    description?: string
}

const MainWrapper = styled.main`
  min-height: 78vh;
`

const FooterStyled = styled.footer`
  min-height: 3vh;
  width: 100%;
  padding: 0 5vw;
  background: ${(props) => props.theme.backgrounds.secondary};
  color: ${(props) => props.theme.colors.secondary};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @media ${device.mobileXS} {
    flex-direction: column;
    h1{
      font-size: 2rem;
    }
    p{
      font-size: 0.8rem;
    }

    @media ${device.laptop} {
      flex-direction: row;
      justify-content: space-between;
      h1{
        font-size: 2rem;
      }
      p{
        font-size: 0.8rem;
      }
}
`


export const MainLayout: FC<PropsWithChildren<Props>> = ({ children, title, description }) => {
  return (
    <>
      <Head>
        <title>{ title || 'Plataforma de Bookers' }</title>
        <meta name="description" content={`${
            description || 
            "Bookers es una colección de 10.000 NFT’s para los amantes de los libros y el conocimiento. En esta plataforma podras acceder a los beneficios de la coleccion."}`
            } />
        <link rel="ico" href="/favicon.ico" />
      </Head>
      <Menu />
        <MainWrapper>
            
            {children}
        
        </MainWrapper>
        
        <FooterStyled>
            <h1>
              Bookers
            </h1>
            <p>
              Bookers 2022, Todos los derechos Reservados.
            </p>
        </FooterStyled>

    </>
  )
}
