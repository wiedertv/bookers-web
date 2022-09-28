import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { MainLayout } from "../../layouts/MainLayout";


const HappyMachineWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    width: 80vw;
    margin: 0 auto;
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
        margin-bottom: 2vh;
        &: hover {
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          transform: scale(1.05);
        }
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

export default function resultado () {

    return (
        <MainLayout>
            <HappyMachineWrapper>
                <h1>
                    Gracias por enviarnos tu selección de Bookers para La Máquina de la Felicidad. <br/>
                    Actualmente estamos contándole chistes sin parar para que no deje nunca de sonreír.<br/>
                    El día 25/07/22 a las 18h CET terminará su terapia y podrás ver su nueva cara actualizando la metadata en Opensea.
                </h1>
                <Image src='/maquina-felicidad.gif' width='500px' height='500px' alt='maquina de la felicidad' />
                <Link href='/'>
                    <a>
                        Inicio
                    </a>
                </Link>
            </HappyMachineWrapper>
        </MainLayout>
    )

}