import React, { FC, PropsWithChildren, useState } from 'react'
import styled from 'styled-components'

interface BurgerProps {
    open: boolean;
}

const BurgerButton = styled.button<BurgerProps>`
    flex-direction: column;
    position: ${({ open }) => open ? 'fixed' : 'relative'};
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 22;

    &:focus {
    outline: none;
    }

    div {
    width: 2.5rem;
    margin: 0.5rem;
    height: 0.30rem;
    background: #1c1c1c;
    border-radius: 10px;
    transition: all 0.3s linear;
    transform-origin: 1px;

    :first-child {
        transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
        opacity: ${({ open }) => open ? '0' : '1'};
        transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
        transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
    }

`


export const Burger : FC<PropsWithChildren<{open:boolean, setOpen: Function}>> = ({open,setOpen}) => {
    return (
        <BurgerButton open={open} onClick={()=> setOpen(!open)}>
            <div></div>
            <div></div>
            <div></div>
        </BurgerButton>
    )
}
