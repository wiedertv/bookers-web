import React, { FC, PropsWithChildren, useEffect } from 'react'
import styled from 'styled-components';
import { device } from '../../utils/devices';
import { fetchQuiz } from '../../utils/functions';


const QuizWrapper = styled.div`
    width: 80%;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    @media ${device.mobileXS} {
        h1{
            font-size: 1.5rem;
        }
    }
    @media ${device.laptop} {
        h1{
            font-size: 2rem;
        }
    }
`;

const Stepper = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    background: ${props => props.theme.backgrounds.primary};
    font-size: 1.5rem;
    font-weight: bold;
    flex-direction: row;
`;
const AnswerWrapper = styled.div<{background?: string, color: string}>`
    display: flex;
    flex-direction: column;
    width: 80%;
    border: 1px solid ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
    }
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    background: ${props => props.background};
    button{
        text-align: left;
        background: ${props => props.background};
        color: ${props => props.theme.colors[props.color]};
        padding: 0.70rem;
        border-radius: 5px;
        border: none;
        font-size: 1.5rem;
    }
`;
const QuestionCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
    `;
const QuestionCardFooter = styled.div``;
const QuestionCardNextButton = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    right: 10%;
    justify-content: center;
    align-items: end;    
    &: hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        transform: scale(1.05);
    }

    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    button{
        background: ${props => props.theme.backgrounds.secondary};
        color: ${props => props.theme.colors.secondary};
        padding: 10px;
        border-radius: 5px;
        border: none;
        font-size: 1.5rem;
    &: disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    }
    `;
const QuestionFeedbackAnswer = styled.div<{color: string, display:boolean}>`
    display: ${props => props.display ? 'block' : 'none'};
    flex-direction: column;
    p{
        font-size: 1.5rem;
        font-weight: bold;
        color: ${props => props.color};
        span{
            font-size: 1.5rem;
            font-weight: bold;
            color: transparent;
            background: ${props => props.color};
            &:hover{
                color: ${props => props.color};
                background: transparent;
                transition: all 0.2s ease-in-out;
            }
    }
`;


interface QuizData{
    id: string;
    totalQuestions: number;
    questions: Question[];
  }

    interface Question{
        id: string;
        question: string;
        answers: string;
        parsedAnswers: Answer[];
        correctAnswer: string;
    }

    interface Answer{
        id: string;
        answer: string;
    }


export const Quiz: FC<PropsWithChildren<{id: string}>> = ({id}) => {
    const [step, setStep] = React.useState(1);
    const [isClicked, setIsClicked] = React.useState(false);
    const [correctAnswer, setCorrectAnswer] = React.useState(0);
    const [isCorrect, setIsCorrect] = React.useState({} as {[key: string]: boolean});
    const [feedback, setFeedback] = React.useState({} as {message: string, color: string});
    const [wrongAnswer, setWrongAnswer] = React.useState(0);
    const [totalAnswer, setTotalAnswer] = React.useState(0);
    const [totalQuestion, setTotalQuestion] = React.useState(0);
    const [totalScore, setTotalScore] = React.useState(0);
    const [showResult, setShowResult] = React.useState(false);
    const [quiz, setQuiz] = React.useState({} as QuizData);

    useEffect(() => {
        fetchQuiz(id).then(data => {
            setQuiz(data);
            setTotalQuestion(data.totalQuestions);
            restartQuiz();
        }).catch();
    }, [id]);

    const checkAnswer = (answer: string) => {
        setIsClicked(true);
        if (answer === quiz.questions[step - 1].correctAnswer) {
            setCorrectAnswer(correctAnswer + 1);
            setTotalScore(totalScore + 1);
            setIsCorrect({...isCorrect, [answer]: true});
            setFeedback({message: 'La respuesta es correcta!', color: 'green'});
        } else {
            setWrongAnswer(wrongAnswer + 1);
            setIsCorrect({...isCorrect, [answer]: false});
            setTotalScore(totalScore - 1);
            setFeedback({message: ` ¡Que mal, la respuesta es incorrecta!`, color: 'red'});
        }
        setTotalAnswer(totalAnswer + 1);
    }

    const nextQuestion = () => {
        setStep(step + 1);
        setIsClicked(false);
        setFeedback({message: '', color: ''});
        setIsCorrect({} as {[key: string]: boolean});
    }

    const showResults = () => {
        setShowResult(true);
    }

    const restartQuiz = () => {
        setStep(1);
        setIsClicked(false);
        setFeedback({message: '', color: ''});
        setIsCorrect({} as {[key: string]: boolean});
        setTotalScore(0);
        setTotalAnswer(0);
        setWrongAnswer(0);
        setCorrectAnswer(0);
        setShowResult(false);
    }

  return (
    <QuizWrapper>
        {/* <h1>
            Próximamente...
        </h1> */}
       {
            quiz && quiz.questions && quiz.questions.length > 0 && !showResult ? (
                <QuestionCard>
                     <h1>
                        {quiz.questions[step - 1].question}
                        </h1>
                    <div>
                    {quiz.questions[step - 1].parsedAnswers.map(answer => (
                        <AnswerWrapper 
                        color={isCorrect[answer.id] !== undefined? isCorrect[answer.id] || isCorrect[answer.id] === false ? 'secondary' : 'primary': 'primary'}
                        background={isCorrect[answer.id] !== undefined? isCorrect[answer.id]?  "green": "red": "transparent"} key={answer.id} >
                            <button onClick={()=> {checkAnswer(answer.id)}} disabled={isClicked}
                            >
                                {answer.answer}
                            </button>
                        </AnswerWrapper>
                    ))}
                    <>
                        <QuestionCardFooter>
                        <QuestionFeedbackAnswer 
                            color={feedback.message && feedback.color ? feedback.color : 'transparent' } 
                            display={!!(feedback.message && feedback.color)}> 
                            <p> {feedback.message} </p>
                        </QuestionFeedbackAnswer>
                            <QuestionCardNextButton>
                                {
                                    step < totalQuestion ? (
                                        <button onClick={()=> nextQuestion()}  disabled={Object.keys(isCorrect).length === 0}>
                                            Siguiente
                                        </button>
                                    ) : (
                                        <button onClick={()=> {
                                            showResults();
                                        }}>
                                            Resultados
                                        </button>
                                    )
                                }
                            </QuestionCardNextButton>
                        </QuestionCardFooter>
                    </>
                    </div>
                    <Stepper>
                        {step} / {totalQuestion}
                    </Stepper>
                </QuestionCard>
            ) : quiz && quiz.questions && quiz.questions.length > 0 && showResult ? ( 
                <QuestionCard>
                    <h1>
                        Resultados de la prueba
                    </h1>
                    <div>
                        <p>
                            Preguntas correctas: {correctAnswer}
                        </p>
                        <p>
                            Preguntas incorrectas: {wrongAnswer}
                        </p>
                        <p>
                            Total preguntas: {totalQuestion}
                        </p>
                    </div>
                    <QuestionCardFooter>
                        <QuestionCardNextButton>
                        <button onClick={()=> {
                                restartQuiz();
                            }}>
                            Intentar de nuevo
                        </button>   
                        </QuestionCardNextButton>
                    </QuestionCardFooter>
                </QuestionCard>
            ) : 
            (
                <h1>
                    Próximamente...
                </h1>
            )
        }
    </QuizWrapper>
  );
}
