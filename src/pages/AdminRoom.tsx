import logoImg from '../assets/images/logo.svg'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles//room.scss'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AnswerQuestion, CreateNewQuestion, EndRoom, HighlihtQuestion, RemoveQuestion } from '../services/firebase' 
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

import trashIcon from '../assets/images/delete.svg'
import checkIcon from '../assets/images/check.svg'
import answerIcon from '../assets/images/answer.svg'


type RoomParams = {
    id: string;
}

export function AdminRoom(){

    const navigate = useNavigate()

    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('')

    const roomId = params.id

    const { questions, roomTitle } = useRoom( roomId, handleSendQuestion )

    async function handleCheckQuestionAsAnswered(questionId: string){
        AnswerQuestion(roomId, questionId)
    }

    async function handleHighlightedQuestion(questionId: string) {
        HighlihtQuestion(roomId, questionId)
    }

    async function handleSendQuestion(event:FormEvent){
        event.preventDefault()

        if(newQuestion.trim() === ""){
            return alert("Digite uma pergunta válida")
        }

        if(!user){
            throw new Error("You must be logged in")
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
            likeCount: 0,
        }

        await CreateNewQuestion(question, roomId)
        setNewQuestion('')
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
            await RemoveQuestion(roomId, questionId)
        }
    }

    async function handleEndRoom(){
        if(window.confirm('Tem certeza que deseja encerrar essa sala?')){
            await EndRoom(roomId)
            navigate('/')
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined
                        onClick={handleEndRoom}
                        >Encerrar sala</Button>
                    </div>
                    
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>{roomTitle}</h1>
                    { 
                    questions.length > 0 && <span>{questions.length} Pergunta(s)</span>
                    }
                    
                </div>

                {questions.map(question => {
                    return(
                        <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                        >
                        {!question.isAnswered && (
                            <>
                                <button
                                type="button"
                                onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                    <img src={checkIcon} alt="Marcar como respodido"/>
                                </button>

                                <button
                                type="button"
                                onClick={() => handleHighlightedQuestion(question.id)}>
                                    <img src={answerIcon} alt="Dar destaque a pergunta"/>
                                </button>
                            </>
                        )}

                            <button
                            type="button"
                            onClick={() => handleDeleteQuestion(question.id)}>
                                <img src={trashIcon} alt="Remover pergunta"/>
                            </button>

                        </Question>
                    )
                })}
            </main>
        </div>
    )
}