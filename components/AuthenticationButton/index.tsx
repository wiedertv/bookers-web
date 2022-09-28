import Image from "next/image";
import { FC, PropsWithChildren, useEffect } from "react";
import { useMoralis } from "react-moralis";
import styled from "styled-components";
import { device } from "../../utils/devices";


interface Props {
    mobile: boolean;
}

interface StyledProps {
    mobile: boolean;
    authenticated: boolean;
}

const AuthButton = styled.button<StyledProps>`
font-size: 1rem;
padding: 0.3rem 1rem;
display: flex;
align-items: center;
justify-content: center;
margin: 0;
font-family: 'Lato', sans-serif;
text-align: center;
min-width: 200px;
background-color: ${props => props.authenticated ? props.theme.backgrounds.secondary : props.theme.backgrounds.primary };
color: ${props => props.authenticated ?  props.theme.colors.secondary : props.theme.colors.primary };
border: 2px solid #1c1c1c;
border-radius: 20px;
@media ${device.mobileXS} {
    display: ${props => props.mobile ? "flex" : "none"};
    min-width: 100px;
    width: 50vw;
}
@media ${device.laptop} {
    display: flex; 
    max-width: 200px;
}

@media ${device.desktop} {
    display: flex;
    max-width: 200px;
}
img {
    width: 100%;
    max-width: 20px;
    height: auto;
}
&:hover {
    cursor: pointer;
]
`;

export const AuthenticationButton: FC<PropsWithChildren<Props>> = ({mobile}) => {
    const { 
      authenticate, 
      isAuthenticated,
      isWeb3EnableLoading,
      isWeb3Enabled,
      logout, 
      account } = useMoralis();
  
      const handleClick = () => {
        if(isAuthenticated){
          logout();
        }else{
          authenticate();
        }
      }
  
      useEffect(() => {
        if(isAuthenticated && !isWeb3EnableLoading && !isWeb3Enabled){
          logout()
        }
      }, [isAuthenticated, account]);
  
    return (
      <AuthButton
        mobile={mobile} 
        onClick={handleClick}
        authenticated={isAuthenticated} 
        >
          <Image src={'/metamask.png'} alt="Metamask" width={20} height={20} />
         {isAuthenticated ? "Desconectar Wallet" : "Conectar Wallet"}
      </AuthButton>
    )
  }