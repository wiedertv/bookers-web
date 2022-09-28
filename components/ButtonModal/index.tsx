import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis';
import styled from 'styled-components';
import { getEllipsisTxt } from '../../utils/formatter';
import { checkVoucherClaimed, claimVoucher } from '../../utils/functions';

const ModalWrapper = styled.div<{isOpen: boolean}>`
    display: ${(props) => props.isOpen ? 'flex' : 'none'};
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 50vw !important; 
    height: 50vh !important;
    div{
        width: 80%;
        margin: 0 auto;
    }
    section{
        display: flex;
        width: 80%;
        flex-direction: column;
        h1{
            font-size: 2rem;
        }
        p{
            font-size: 1.5rem;
            a{
                color: ${(props) => props.theme.colors.primary};
                background: transparent;
                border: none;
                cursor: pointer;
                shadow: none;
                outline: none;
                padding: 0;
                margin: 0;
                border-radius: 0;
                box-shadow: none;
                &: hover {
                    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    border-radius: 20px;      
                    padding: 0.5rem 1rem;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                    transform: scale(1.05);
                  }
            }
        }
    }
    button{
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
      margin-bottom: 2vh;
      margin-right: 2vh;
      &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
      }
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
    background: ${(props) => props.theme.backgrounds.primary};
    border-radius: 10px;
`;

const StyledButton = styled.button`
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
`;

const Loader = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
`;


export const ButtonModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [canClaim, setCanClaim] = useState(true);
    const [voucher, setVoucher] = useState<{voucher: string| null, canClaim: boolean, daysLeft: number}>( {voucher: null, canClaim: true, daysLeft: 0} );
    const { 
        isAuthenticated, 
        account } = useMoralis();

    const claimTicket = async (account:string) => {
        setIsLoading(true);
        const response = await claimVoucher(account)
        setIsLoading(false);
        if(response.status === "success"){
            setVoucher({voucher: response.voucher, canClaim: false, daysLeft: response.daysLeft});
            setCanClaim(false);
        }
    }

    useEffect(() => {
        if(modalOpen && account){
            setIsLoading(true);
            checkVoucherClaimed(account).then(res => {
                setIsLoading(false);
                if(res.voucher){
                    setCanClaim(res.canClaim);
                    setVoucher(res);
                }
            }).catch(err => { 
                console.log(err);
                setIsLoading(false);
            });
        }
        
    }, [account, modalOpen])
    

  return (
    <>{isAuthenticated ? (
    <StyledButton onClick={()=> {setModalOpen(true)}}>
        Solicita tu ticket de Nextory
    </StyledButton>
    ): null }
    {modalOpen ? <ModalWrapper isOpen={modalOpen}>
                        <Modal >
                            {
                                isLoading ? ( <>
                                            <Loader>
                                                <Image src={`/bookers-animation.gif`} alt="loading" layout='fill' objectFit='scale-down'/>
                                            </Loader>
                                </>) :
                                canClaim ? <>
                                                <section>    
                                                    <h1>Hola {getEllipsisTxt(account || '')}</h1>
                                                    <p>¿Deseas generar un código para acceder a Nextory durante 60 días gratis?</p>
                                                </section>

                                                <div>
                                                    <button onClick={()=> {
                                                        claimTicket(account || '');
                                                    }
                                                    }>
                                                        Sí, generar código
                                                    </button>
                                                    <button onClick={()=> {
                                                        setModalOpen(false);
                                                    }
                                                    }>
                                                        No, cancelar.
                                                    </button>
                                                </div>    
                                            </> :
                                <>
                                    <section>
                                        <h1>Hola {getEllipsisTxt(account || '')}</h1>
                                        <p>Tu código de 60 días GRATIS para Nextory es: <b>
                                        {voucher.voucher?.toUpperCase()}
                                            </b></p>
                                        <p>
                                            Puedes usarlo a través de la página: <a 
                                            href="https://www.nextory.es/partner-collaboration/bookers/" 
                                            target="_blank" rel="noopener noreferrer"> 
                                            https://www.nextory.es/partner-collaboration/bookers/
                                            </a> 
                                        </p>
                                        <p>Esperamos que disfrutes con Nextory</p>
                                    </section>
                                    <div>
                                        <button onClick={()=> {
                                            setModalOpen(false);
                                        }
                                        }>
                                            Cerrar
                                        </button>
                                    </div>  
                                </> 
                                
                            }
                        </Modal>
        </ModalWrapper> : null }
    </>
    
  )
}
