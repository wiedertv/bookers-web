import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis';
import styled from 'styled-components';
import { MainLayout } from '../../layouts/MainLayout'
import { alreadyFilledHappyMachine, enviarBookers, fetchMaquinaFelicidadTokens } from '../../utils/functions';

const HappyMachineWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
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
      &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
      }
      &: disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
`;

const HeroText = styled.div`

    display: flex;
    flex-direction: column;
    width: 70%;
    margin: 0 auto;
    h1{
        font-size: 3rem;
        font-weight: bold;
    }

`;

const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 80vw;
  margin: 8vh auto;
  grid-gap: 2rem;
  justify-items: center;
`;

const TokenCard = styled.div<{isSelected: boolean}>`
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    border-radius: 10px;
    &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
    }
    img{
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    h1{
        position: absolute;
        top: 0%;
        margin: 0;
        padding: 0;
        color: white;
        background: rgba(0,0,0,0.5);
    }
    border: ${(props) => props.isSelected ? '4px solid blue' : 'none'};
    background: ${(props) => props.isSelected ? 'blue' : 'transparent'};

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`

const SelectorWrapper = styled.div<{anySelected: boolean}>`
    position: fixed;
    bottom: 0;
    left: 33%;
    background: ${(props) => props.theme.backgrounds.primary};
    width: 30vw;
    height: 5vh;
    flex-direction: row;
    display: ${(props) => props.anySelected ? 'block' : 'none'};
    h1{
        margin: 0;
        padding: 0;
        text-align: center;
    }
    &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
    }
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const ModalWrapper = styled.div<{isOpen: boolean}>`
    display: ${(props) => props.isOpen ? 'flex' : 'none'};
    position: fixed;
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
    width: 50vw; 
    height: 50vh;
    div{
        width: 80%;
        margin: 0 auto;
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

export default function MaquinaDeLaFelicidad()  {
    const [tokens, setTokens] = useState<{id: string, metadata: any}[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();
    const { 
        isAuthenticated,
        isWeb3EnableLoading,
        isWeb3Enabled,
        logout, 
        account
        } = useMoralis();


    useEffect(() => {
        if(!isWeb3Enabled && !isWeb3EnableLoading ) {
            logout();
        }
        if (!isAuthenticated){
            router.push('/');
        }else if(account){
            alreadyFilledHappyMachine(account).then(res => {
                if(res){
                    router.push('/maquina-felicidad/resultado');
                }
            }).catch(err => {});
            fetchMaquinaFelicidadTokens(account).then(data => {
                if(data && data.length > 0) {
                    setTokens(data);
                }else{
                    setTokens([]);
                }
            }).catch();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isWeb3Enabled, isWeb3EnableLoading, account]);

    
    const handleSelected =(id: string) => {
        const newSelectedTokens = [...selectedTokens];
        if(newSelectedTokens.includes(id)){
            newSelectedTokens.splice(newSelectedTokens.indexOf(id), 1);
        }
        else{
            newSelectedTokens.push(id);
        }
        setSelectedTokens(newSelectedTokens);
    }

    
    return (
    <MainLayout>
        {account && (
            <>
                <HappyMachineWrapper>
                    <HeroText>
                        <h1>Maquina de la felicidad</h1> 
                        <p>
                        Bienvenid@ al formulario de inscripción de La Máquina de la Felicidad.
                        </p>
                        <p>
                        La función de esta Máquina es convertir tus Bookers tristes en Bookers Felices. ☹️➡️😃
                        </p>
                        <p>
                        Para ello, solo tienes que seleccionar en este formulario los Bookers que quieres pasar por la Máquina y darle a enviar.
                        </p>
                        Antes de eso, asegúrate de leer atentamente las siguientes indicaciones:
                        <ul>
                            <li>
                                    Este formulario estará operativo entre el miércoles 13 a las 18h CET y el sábado 16 a las 18h CET. Pasado ese plazo, no será posible aplicar a La Máquina de la Felicidad.
                            </li>
                            <li>
                                    Solo pueden pasar por la máquina los Bookers con las siguientes características: Desesperación, Nervios, Tristeza, Arrepentimiento, Desagrado, Susto y Ansiedad. Por eso, aunque tengas más Bookers en tu cartera, aquí solo podrás visualizar los que tengan esa rareza.
                            </li>
                            <li>
                                    El NFT que selecciones para La Máquina de la Felicidad no puede estar listado en OpenSea (no puede tener un precio de venta). Aunque aquí aparezca y te deje marcarlo, si a la hora de hacer el cambio lo vemos listado, no lo realizaremos.
                            </li>
                            <li>
                                    Solo podrás darle a enviar UNA VEZ. Por lo tanto, asegúrate de marcar todos los Bookers que desees cambiar y, sobre todo, ten en cuenta que una vez enviado, no podrás rectificarlo.
                            </li>
                            <li>
                                    Por último, una vez cerrada la inscripción, el equipo dispondrá de una semana para realizar los cambios en los Bookers que hayáis inscrito.
                            </li>
                        </ul>
                    <h1>
                        Tienes {tokens.length} Bookers en tu cartera que puedes alegrar.
                    </h1>
                    </HeroText>
                    <CardsWrapper>
                        {tokens.map((token, id) => (
                            <TokenCard key={id} onClick={()=> { handleSelected(token.id)}} isSelected={selectedTokens.includes(token.id)}>
                                <img src={`https://ipfs.io/ipfs/${token.metadata.image.split('//')[1]}`} alt={token.metadata.name} />
                                <h1>{token.metadata.name}</h1>
                            </TokenCard>
                        ))}
                    </CardsWrapper>
                    <button onClick={()=> {setModalOpen(true)}} disabled={selectedTokens.length === 0}>
                            Enviar
                    </button>
                </HappyMachineWrapper>

                <SelectorWrapper anySelected={selectedTokens.length > 0 } >
                    <h1>Tienes {selectedTokens.length} seleccionados</h1>
                    
                </SelectorWrapper>

                <ModalWrapper isOpen={modalOpen}>
                    <Modal >
                        <div>
                            <h1>¿Estás segur@ de que deseas enviar tu selección?</h1>
                            <p>
                                Recuerda que una vez enviado, no es posible modificar la selección. Es decir, no podrás añadir más Bookers o quitar alguno que hayas marcado.
                            </p>
                            <h3>
                                ¿Deseas continuar?
                            </h3>
                            <button onClick={()=> {
                                setModalOpen(false);
                                enviarBookers( selectedTokens, account).then(res => {
                                    if(res){
                                        router.push('/maquina-felicidad/resultado');
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });
                            }
                            }>
                                Enviar
                            </button>
                            <button onClick={()=> {
                                setModalOpen(false);
                            }
                            }>
                                Cancelar
                            </button>
                        </div>
                    </Modal>
                </ModalWrapper>
            </>
        )}
    </MainLayout>
  )
}
