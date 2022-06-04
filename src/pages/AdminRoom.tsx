import logoImg from '../assets/images/logo.svg'
import { useParams } from 'react-router-dom'
import '../styles//room.scss'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CreateNewQuestion } from '../services/firebase' 
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'


type RoomParams = {
    id: string;
}

export function AdminRoom(){

    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('')

    const roomId = params.id

    const { questions, roomTitle } = useRoom( roomId, handleSendQuestion )

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
            isAnswered: false
        }

        await CreateNewQuestion(question, roomId)
        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <RoomCode code={roomId}/>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>{roomTitle}</h1>
                    { 
                    questions.length > 0 && <span>{questions.length} Pergunta(s)</span>
                    }
                    
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="O que voce quer perguntar?"
                    onChange={event => {setNewQuestion(event.target.value)}}
                    value={newQuestion}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name}/>
                                <span>{user.name}</span>
                            </div>
                        ):(
                            <span>Para enviar um pergunta, <button>faça seu login</button>.</span>  
                        )}
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form> 
                {questions.map(question => {
                    return(
                        <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}/>
                    )
                })}
            </main>
        </div>
    )
}