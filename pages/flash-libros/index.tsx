import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import { Card } from '../../components/Card';
import { MainLayout } from '../../layouts/MainLayout';
import CourseData from '../../utils/flashlibros.json';
import {useAuth} from "../../hooks/useAuth";


const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 80vw;
  margin: 8vh auto;
  grid-gap: 2rem;
  justify-items: center;
`;



const FlashLibros = () => {

  const router = useRouter();
  const { 
    isAuthenticated,
    logout, 
    } = useAuth();

    useEffect(() => {
      if (!isAuthenticated){
        logout().then(() => {router.push('/');});
      }
  })

  return (
    <MainLayout>
        <CardsWrapper> 
            {CourseData.map((course, id) => (
              <Card key={`${course.nombre}-${id}`} course={course} />
            ))}
        </CardsWrapper>
    </MainLayout>
  )
}

export default FlashLibros
