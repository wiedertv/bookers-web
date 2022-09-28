import React, { FC, PropsWithChildren, RefObject, useEffect, useLayoutEffect } from 'react'
import styled from 'styled-components'
import StyledLink from '../StyledLink';


const PanelItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  padding: 0.5rem 0;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.2);
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.secondary};
  }
`;

const PanelTitle = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  padding: 1rem;
  color: ${props => props.theme.colors.secondary};
`;

const PanelBody = styled.div<{active: boolean, bodyHeight: number, multiplier: number}>`
  display: block;
  position: relative;
  padding: 0;
  margin: 0;
  width: 100%;
  overflow: hidden;
  transition: height 0.3s;
  color: ${props => props.theme.colors.secondary};
  height: ${props => props.active ? (props.bodyHeight * props.multiplier) : 0}px;
`;

const PanelContent = styled.div`
  display: flex;
  margin:0;
  position: relative;
  flex-direction: column;
  width: 100%;
  min-height: 90px;
  transition: all 0.2s ease-in-out;
  padding: 0.5rem 0;
  p{
    margin: 0;
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
    font-weight: bold;
    width: 20%;
    text-align: center;
    position: absolute;
    top: 5%;
    right: 0;
    background: ${props => props.theme.backgrounds.primary};
    border-radius: 0.5rem;
    color: ${props => props.theme.colors.primary};
    &:hover {
      color: ${props => props.theme.colors.highlight};
    }
  }
  &:hover {
    cursor: pointer;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.secondary};
  }
`;

interface Chapter {
  contenido_clase:string; 
  curso_identificador: string;
  curso_nombre: string;
  id: string;
  nombre_clase: string;
  nombre_seccion: string;
  numero_clase: string;
  numero_seccion: string;
  tipo_clase: string;
  url_clase: string;
}

interface Sections{
  title: string;
  chapters: Chapter[];
}

interface Data {
  courseName: string;
  courseId: string;
  sections: Sections[];
  actualChapter?: Chapter;
}

interface Props {
  data: Data;
  refs: React.RefObject<HTMLDivElement>[];
  currentPanel: number;
  setCurrentPanel: (panel: number) => void;
  setBodyHeight: (height: number) => void;
  bodyHeight: number;
}

const PanelItems: FC<PropsWithChildren<Props>> = ({
  data,
  refs,
  currentPanel,
  setCurrentPanel,
  setBodyHeight,
  bodyHeight
}) => {


  return (
    <>
      {data.sections.map(({ title, chapters }, i) => (
        <PanelItem key={`accordion-item-${i}`}>
          <PanelTitle
            onClick={() => {
              if(currentPanel === i) {
                setCurrentPanel(data.sections.length);
                setBodyHeight(0);
                return;
              }
              setCurrentPanel(i);
              setBodyHeight(refs[i]?.current?.clientHeight || 0);
            }}
          >
            {title}
          </PanelTitle>
          <PanelBody active={currentPanel === i} bodyHeight={bodyHeight} multiplier={chapters.length}>
            {chapters.map(({  tipo_clase, nombre_clase, numero_clase }) => (
              <PanelContent key={`${nombre_clase}-${numero_clase}`} ref={refs[i]}>
                  <p>
                    {tipo_clase}
                  </p>
                  <StyledLink href={`/flash-libros/${data.courseId}/${numero_clase}`}>{nombre_clase}</StyledLink>  
              </PanelContent>
            ))}
          </PanelBody>
        </PanelItem>
      ))
      }
    </>
  )
}

interface PanelsProps {
  data: Data;
}

export const Panels : FC<PropsWithChildren<PanelsProps>> = ({data}) => {

  const [currentPanel, setCurrentPanel] = React.useState(data?.sections.length| 0);
  const [bodyHeight, setBodyHeight] = React.useState(0);
  const refs: React.RefObject<HTMLDivElement>[] = data?.sections.map(() => React.createRef<HTMLDivElement>());

  return (
    <>
      <PanelItems
        data={data}
        refs={refs}
        currentPanel={currentPanel}
        setCurrentPanel={setCurrentPanel}
        setBodyHeight={setBodyHeight}
        bodyHeight={bodyHeight}
      />
    </>
  )
}
