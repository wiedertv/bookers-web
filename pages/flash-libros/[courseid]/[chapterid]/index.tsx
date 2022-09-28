import { useRouter } from 'next/router'
import Image from 'next/image';
import { MainLayout } from '../../../../layouts/MainLayout'
import styled from "styled-components";
import Link from 'next/link';
import { Panels } from '../../../../components/Panels';
import { device } from '../../../../utils/devices';
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { fetchCourse } from '../../../../utils/functions';
import { Quiz } from '../../../../components/Quiz';







//#region [Styles Start]
const Breadcrumbs = styled.ul<{separator?:string}>`
  list-style: none;
  padding: 0;
  & > li:after {
    content: "${props => props.separator || "/"}";
    padding: 0 8px;
  }
`;

const Crumb = styled.li`
  display: inline-block;
  color: ${(props) => props.theme.colors.secondary};
  &:last-of-type:after {
    content: "";
    padding: 0;
  }

  a {
    color: ${(props) => props.theme.colors.secondary};
    text-decoration: none;
    &:hover,
    &:active {
      text-decoration: underline;
      color: ${(props) => props.theme.colors.highlight}
    }
  }
`;

const CrumbWrappers = styled.section`
  display: flex;
  flex-direction: row;
  padding: 0 3rem;
  background: ${props => props.theme.backgrounds.secondary};
`

const PlayerWrapper = styled.div`
  width: 99vw;
  min-height: 85vh;
  display: grid;
  grid-template-columns: 25% 75%;
  grid-template-areas: "sidebar content";
  @media ${device.mobileXS} {
    grid-template-columns: 1fr;
    grid-template-areas: "content";
    width: 100%;
    height: 100%;
    min-height: 50vh;
  }

  @media ${device.laptop} {
    grid-template-columns: 30% 70%;
    grid-template-areas: "sidebar content";  
    width: 99vw;
    min-height: 85vh;
  }
  @media ${device.laptopL} {
    grid-template-columns: 20% 80%;
    grid-template-areas: "sidebar content";  
    width: 99vw;
    min-height: 85vh;
  }
`;

const Sidebar = styled.aside<{open:boolean}>`
  grid-area: sidebar;
  background: ${props => props.theme.backgrounds.secondary};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  border-right: 1px solid ${props => props.theme.colors.secondary};
  &::-webkit-scrollbar-track {
    border: 1px solid #000;
    padding: 2px 0;
    background-color: #404040;
  }
  
  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #737272;
    border: 1px solid #000;
  }
  @media ${device.mobileXS}{
    display: flex;
    z-index: 10;
    padding-top: 4rem;
    flex-direction: column;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    text-align: center;
    background: ${({ theme }) => theme.backgrounds.secondary};
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
    position: ${({ open }) => open ? 'fixed' : 'absolute'};
    top: 0;
  }
  
  @media ${device.laptop} {
    background: ${props => props.theme.backgrounds.secondary};
    padding: 1rem;
    display: flex;
    height:100vh;
    overflow-y: auto;
    flex-direction: column;
    justify-content: start;
    border-right: 1px solid ${props => props.theme.colors.secondary};
    position: relative;
    transform: translateX(0);
    text-align: left;
    padding-top: 0;
  }
`;

const Content = styled.section`
  grid-area: content;
  background: ${props => props.theme.backgrounds.primary};
  display: flex;
  flex-direction: column;
  justify-content: start;

`;

const ChapterTitle = styled.div`
  border-bottom: 1px solid ${props => props.theme.backgrounds.secondary};
  position: relative;
  padding: 0 2rem;
  h1 {
    margin: 10px 0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
  @media ${device.mobileXS}{
    h1{
      width: 90%;
      font-size: 1.2rem;
    }
  }
  @media ${device.laptop} {
    h1 {
      margin: 10px 0;
      padding: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const TextContainer = styled.div`
  padding: 1rem 2rem;
  width: 90%;
  max-height: 100vh;
  overflow-y: scroll;
  margin: 0 auto;
  text-align: justify;
  `;

const MobileSidebarButton = styled.button<{open:boolean, top?: string, right?: string}>`
  display: none;
  @media ${device.mobileXS} {
    display: block;
    color: ${ ({ theme, open}) => open ? theme.colors.secondary : theme.colors.primary};
    position: absolute;
    background: transparent;
    border: none;
    top: ${({ top }) => top || '0'};
    right: ${({ right }) => right || '0'};
  }
  @media ${device.laptop}{
    display: none;
  }

`;

const Loader = styled.div`
  position: relative;
  width: 100vw;
  height: 90vh;
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
`;
//#endregion

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

const Course = () => {
  const router = useRouter()
  const check = router.asPath;
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<Data>();
  const { courseid, chapterid } = router.query
  const { 
    authenticate, 
    isAuthenticated,
    isWeb3EnableLoading,
    isWeb3Enabled,
    logout, 
    account } = useMoralis();

  useEffect(() => {
    if (!isAuthenticated){
      router.push('/');
    }
  })

  useEffect(() => {
    if(isAuthenticated && account && !course ){
      fetchCourse(
        courseid as string,
        account,
        chapterid as string
      ).then(
        course=>{
          setCourse(course);
        })
      .catch();
    }else if(isAuthenticated && account && course && course.actualChapter?.numero_clase !== chapterid){
      const actualChapter = course.sections.find(section => section.chapters.find(chapter => chapter.numero_clase === chapterid));
      if(actualChapter){
        setCourse({
          ...course,
          actualChapter: actualChapter.chapters.find(chapter => chapter.numero_clase === chapterid)
        })
      }
    }else{
      return;
    }
  },[account, courseid, chapterid, isAuthenticated, course])

  useEffect(() => {
    setOpen(false);
  }, [check])

  return (
    <MainLayout>
      {
        isAuthenticated && account && course ?  
        (<>
          <CrumbWrappers>
            <Breadcrumbs>
              <Crumb>
                <Link href={`/`}>
                  Inicio
                </Link>
              </Crumb>
              <Crumb>
                <Link href={`/flash-libros`}>
                  Cursos
                </Link>
              </Crumb>
              <Crumb>
                {course?.courseName}
              </Crumb>
              <Crumb>
                {chapterid}
              </Crumb>
            </Breadcrumbs>
          </CrumbWrappers><PlayerWrapper>
              <Sidebar open={open}>
                <MobileSidebarButton onClick={() => setOpen(!open)} open={open} top="4%" right="4%">
                  {open ? 'Cerrar' : 'Menu'}
                </MobileSidebarButton>
                <Panels data={course} />
              </Sidebar>
              <Content>
                <ChapterTitle>
                  <h1>{course.actualChapter?.nombre_clase}</h1>
                  <MobileSidebarButton onClick={() => setOpen(!open)} open={open} top="30%" right="4%">
                    {open ? 'Cerrar' : 'Menu'}
                  </MobileSidebarButton>
                </ChapterTitle>
                {course.actualChapter && course.actualChapter.tipo_clase === 'Video' && (
                  <>
                    <iframe src={`${course.actualChapter.url_clase}` } key={check} 
                    style={{ border: 0, maxWidth: "100%", height: "100%", width: "100%" }} 
                    allowFullScreen allow="encrypted-media"></iframe>
                  </>
                )}
                {course.actualChapter && course.actualChapter.tipo_clase === 'Audio' && (
                  <>
                    <audio style={{ border: 0, maxWidth: "100%", margin: "3vh 0", width: "100%" }} controls src={`${course.actualChapter.url_clase}`}></audio>
                    <TextContainer dangerouslySetInnerHTML={{ __html: course.actualChapter.contenido_clase || '' }}></TextContainer>
                  </>
                )}
                {course.actualChapter && course.actualChapter.tipo_clase === 'PDF' && (
                  <>
                    <TextContainer dangerouslySetInnerHTML={{ __html: course.actualChapter.contenido_clase || '' }}></TextContainer>
                    <iframe src={`${course.actualChapter.url_clase}`} style={{ border: 0, maxWidth: "100%", height: "100%", width: "100%" }} allowFullScreen allow="encrypted-media"></iframe>
                  </>
                )}
                {course.actualChapter && course.actualChapter.tipo_clase === 'Texto' && (
                  <TextContainer dangerouslySetInnerHTML={{ __html: course.actualChapter.contenido_clase || '' }}></TextContainer>
                )}
                {course.actualChapter && course.actualChapter.tipo_clase === 'Quiz' && (
                  <Quiz id={course.actualChapter.id}/>
                )}

              </Content>
            </PlayerWrapper>
          </>)
        : (
        <Loader>
          <Image src={`/bookers-animation.gif`} alt="loading" layout='fill' objectFit='scale-down'/>
        </Loader>
        )
      }
    </MainLayout>
  )
}

export default Course