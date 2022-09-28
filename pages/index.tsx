import type { NextPage } from 'next'
import Image from 'next/image';
import { forwardRef, useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { useMoralis } from 'react-moralis';
import styled from 'styled-components'
import { MainLayout } from '../layouts/MainLayout'
import animationData from '../utils/animation.json'
import { device } from '../utils/devices';
import { checkHolder } from '../utils/functions';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ButtonModal } from '../components/ButtonModal';

//#region [CSS START]
const HeroWrapper = styled.main`
display: grid;
flex-direction:row;
grid-template-areas: 'Text Animation';
justify-content: space-around;
column-gap: 5%;
grid-template-columns: auto auto;
  padding: 1.5rem;
  @media ${device.mobileXS} {
    margin: 0;
    width: 100vw;
    grid-template-areas: 
    'Animation Animation'
    'Text Text';
    column-gap: 0;
  }
  @media ${device.laptop}{
    margin: 0 auto;
    width: 95vw;
    grid-template-areas: 'Text Animation';
    justify-content: space-around;
    column-gap: 5%;
    grid-template-columns: auto auto;
    padding: 1.5rem;
  }
  @media ${device.laptopL}{
    margin: 0 auto;
    width: 95vw;
    grid-template-areas: 'Text Animation';
    justify-content: space-around;
    column-gap: 5%;
    grid-template-columns: auto auto;
    padding: 1.5rem;
    margin: 7vh auto;
  }
`;

const StoreButton = styled.a`
  background: ${(props) => props.theme.colors.highlight} !important;
`;

const HeroText = styled.div`
  grid-area: Text;
  h1{
    font-size: 5rem;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 900;
    font-family: Lato;
    margin: 5vh 0 0 0;
    span{
      color: ${(props)=> props.theme.colors.highlight}
    }
  }
  p{
    color: ${(props) => props.theme.colors.primary};
  }
  div{
    width: 100%;
    display: flex;
    a{
      margin-top: 2vh;
      text-decoration: none;
      color: ${(props) => props.theme.colors.secondary};
      background: ${(props) => props.theme.backgrounds.secondary};
      padding: 0.5rem 1rem;
      border-radius: 20px;
      text-align: left;
      align-self: center;
      justify-self: start;
      font-size: 1.3rem;
      margin-right: 2vw;
      &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
      }
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
  }

  
  @media ${device.mobileXS} {
    margin: 0 auto;
    padding: 0 5vw;
    text-align:center;
    h1{  
      font-size: 2.5rem;
    }
    p{
      font-size: 1rem;
    }
  }

  @media ${device.mobileS} {
    margin: 0 auto;
    padding: 0 10vw;
    text-align:center;
    h1{  
      font-size: 2.5rem;
    }
    p{
      font-size: 1rem;
    }
  }

  @media ${device.tablet}{
    h1{
      font-size: 5rem;
      font-weight: 900;
      font-family: Lato;
      margin: 5vh 0 0 0;
    }
    p{
      font-size: 2rem;
    }
  }

  @media ${device.laptop}{
    padding: 0;
    h1{
      text-align: left;
      font-size: 3rem;
      font-weight: 900;
      font-family: Lato;
      margin: 5vh 0 0 0;
    }
    p{
      
      text-align: left;
      font-size: 1rem;
      color: ${(props) => props.theme.colors.primary};
    }
  }
  @media ${device.laptopL}{
    padding: 0;
    margin: 4vh 0;
    h1{
      text-align: left;
      font-size: 5rem;
      font-weight: 900;
      font-family: Lato;
      margin: 5vh 0 0 0;
    }
    p{
      
      text-align: left;
      font-size: 1.5rem;
      color: ${(props) => props.theme.colors.primary};
    }
  }
`

const HeroAnimation = styled.div`
  grid-area: Animation;
  @media ${device.mobileXS} {
    width: 100%;
    margin: 0;
  }
  @media ${device.laptop} {
    width: 100%;
    max-width: 600px;
    margin: 0;
  }
`

const AdventureWrapper = styled.div`

  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
  grid-template-rows: auto auto;
  grid-template-areas: '. Title .'
                       'Cards Cards Cards';
  @media ${device.mobileXS} {
    margin: 0 auto;
    grid-template-columns: auto auto;
    grid-template-areas: 'Title Title'
                         'Cards Cards';
                         
  }
  @media ${device.tablet} {
    margin: 0 auto;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    grid-template-rows: auto auto;
    grid-template-areas: '. Title .'
    'Cards Cards Cards';
                         
  }
  @media ${device.mobileXS} {
    margin: 0 auto;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    grid-template-rows: auto auto;
    grid-template-areas: '. Title .'
    'Cards Cards Cards';
                         
  }
  
`
const AdventureTitle = styled.div`
  grid-area: Title;
  h1{
    font-size: 5rem;
    text-align:center;
    margin: 0;
    color: ${(props) => props.theme.colors.primary};
  }
  p{
    text-align:center;
  }
  @media ${device.mobileXS} {
    margin: 0 auto;
    padding: 0 10vw;
    h1{
      font-size: 2.5rem;
    }
    p{
      font-size: 1rem;
    }
  }
  @media ${device.laptopL}{
    h1{
      font-size: 5rem;
      text-align:center;
      margin: 0;
      color: ${(props) => props.theme.colors.primary};
    }
    p{
      text-align:center;
      font-size: 2rem;
    }
  }
  
`

const AdventureCards = styled.div`
  grid-area: Cards;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-around;
  align-items: center;
  column-gap: 5%;
  padding: 0;
  button{
    background-color: ${(props) => props.theme.colors.primary};
    padding:0;
    border: 0;
    background: transparent;
    width: 600px;
    height: 600px;
    position: relative;
    span{
      img{
        &: hover {
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          transform: scale(1.05);
        }
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
      }
    }
  }
  @media ${device.mobileXS} {
    grid-template-columns: auto;
    margin: 0 auto;
    button{  
      width: 250px;
      height: 250px;
    }
  }
  @media ${device.tablet} {
    margin: 0 auto;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    grid-template-rows: auto auto;
    grid-template-areas: '. Title .'
    'Cards Cards Cards';    
    button{  
      width: 350px;
      height: 350px;
    }
                         
  }
  @media ${device.laptop} {
    margin: 0 auto;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    grid-template-rows: auto auto;
    grid-template-areas: '. Title .'
    'Cards Cards Cards';    
    button{  
      width: 400px;
      height: 400px;
    }
                         
  }
  @media ${device.laptopL} {
    margin: 0 auto;
    grid-template-columns: auto auto auto;
    justify-content: center;
    align-items: center;
    row-gap: 20px;
    grid-template-rows: auto auto;
    grid-template-areas: '. Title .'
    'Cards Cards Cards';    
    button{  
      width: 500px;
      height: 500px;
    }
                         
  }
`

//#endregion


const options = {
  loop: true,
  autoplay: true, 
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
  } 



  const handleLeaderSummaries = () => {
    const a = document.createElement("a");
    a.setAttribute('href', 'https://www.leadersummaries.com/es/libros?corporation_nv=ce76a3743f174dbaf284134213e74435');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener origin-when-cross-origin');
    a.click();
    a.remove();
  };

const Home: NextPage = () => {
  const router = useRouter();
  const { 
    authenticate, 
    isAuthenticated, 
    account } = useMoralis();
  const [isHolder, setIsHolder] = useState(false);

  if (typeof window !== 'undefined') {
    const { ethereum } = window as any;
    localStorage.setItem('eth', ethereum?.isMetaMask);
}

    const handleAuthenticate = () => {
      authenticate({
        provider: 'metamask',
        signingMessage: 'Autenticacion de la aplicacion de Bookers, Estas preparado para entrar a incrementar tu conocimiento ?'
      })
    };

    useEffect(() => {
      if (isAuthenticated && account) {
        checkHolder(account).then(res => {
          setIsHolder(res);
        }
        )
      }
    }, [account, isAuthenticated]);
  
    // eslint-disable-next-line react/display-name
    const FlashLibrosImage = forwardRef((props, ref) => (
      // @ts-ignore
      <div ref={ref}>
        <Image src='/flash_button.png' alt='leaderSummaries' layout='fill' objectFit='cover' {...props} priority/>
      </div>
  ));

  return (
    <>
      <MainLayout>
        <>
          <HeroWrapper>
            <HeroText>
              <h1>
                Desata el poder
                <br/>
                del <span> conocimiento </span>
              </h1>
              <p>
              ¿Estás listo para alcanzar tu mejor versión? <br/>
              Aquí podrás acceder a las formaciones de Leader Summaries y Flash Libros. <br/>
              Conecta tu Metamask y elige a que formación quieres acceder.<br/>
              </p>
              <div>
                <a href={'https://bookers.club'} rel='noopener noreferrer' target='_blank'>
                    Saber más de Bookers
                </a>
                <StoreButton href={'https://store.bookers.club/'} rel='noopener noreferrer' target='_blank'>
                    Entra a la Bookers Store
                </StoreButton>
                <ButtonModal />

              </div>
            </HeroText>
            <HeroAnimation >
              <Lottie 
              options={ options }
                isClickToPauseDisabled
              />
            </HeroAnimation>
          </HeroWrapper>
          <AdventureWrapper>
            <AdventureTitle>
              <h1>Elige tu aventura de hoy</h1>
              <p>Selecciona a qué formación quieres entrar</p>
            </AdventureTitle>
            <AdventureCards>
              { isAuthenticated && isHolder ?  (
                // <form>
                //   <button type='submit' formMethod='GET' formAction={`/api/leadersummaries`}>
                //     <input hidden name='wallet' value={account || ''} />
                //     <Image src='/leader_button.png' alt='leaderSummaries' layout='fill' objectFit='cover' />
                //   </button>
                // </form>
                <button onClick={()=> handleLeaderSummaries()}>
                    <Image src='/leader_button.png' alt='leaderSummaries' layout='fill' objectFit='cover' />
                </button>
                ): (
                  <button onClick={()=> handleAuthenticate()}>
                    <Image src='/leader-no-metamask.png' alt='leaderSummaries' layout='fill' objectFit='cover' />
                  </button>
                )}

              { isAuthenticated && isHolder ?  (
                <button>
                  <Link href={`/flash-libros`}>
                    <FlashLibrosImage />
                  </Link>
                </button>
                  
                ): (
                  <button onClick={()=> handleAuthenticate()}>
                    <Image src='/flash-no-metamask.png' alt='leaderSummaries' layout='fill' objectFit='cover' priority />
                  </button>
                )}

            </AdventureCards>
          </AdventureWrapper>

        </>
      </MainLayout>
    </>
  )
}

export default Home
