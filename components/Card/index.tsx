import Image from 'next/image';
import Link from 'next/link';
import React, { FC, PropsWithChildren } from 'react'
import styled from 'styled-components';
import { device } from '../../utils/devices';

interface Course{
    nombre: string;
    imagen: string;
    identificador: string;
}

interface Props{
    course: Course
}

const CardWrapper = styled.div`
    display: block;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 350px;
    height: 200px;
    border-radius: 10px;
    background-color: ${props => props.theme.backgrounds.secundary};
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
    }
    @media ${device.mobileXS} {
        width: 180px;
        height: 70px;
    }
    
    @media ${device.mobileS} {
        width: 250px;
        height: 120px;
    }
    
    @media ${device.tablet} {
        width: 300px;
        height: 150px;
    }
`;

export const Card: FC<PropsWithChildren<Props>> = ({course}) => {
  return (
    <CardWrapper>
        <Link href={`/flash-libros/${course.identificador}/1`}>
            <Image src={course.imagen} alt={course.nombre} layout='fill' objectFit="cover"  />
        </Link>
    </CardWrapper>
  )
}
