import logoImg from '../assets/images/logo.svg'
import { useParams } from 'react-router-dom'
import '../styles//room.scss'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { CreateNewQuestion } from '../services/firebase' 


type RoomParams = {
    id: string;
}

export function Room(){

    const { user } = useAuth()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('')

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
                    <h1>Nome da Sala</h1>
                    <span>4 Perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="O que voce quer perguntar?"
                    onChange={event => {setNewQuestion(event.target.value)}}
                    value={newQuestion}
                    />
                    <div className="form-footer">
                        <span>Para enviar um pergunta, <button>faça seu login</button>.</span>
                        <Button type="submit">Enviar Pergunta</Button>
                    </div>
                </form> 
            </main>
        </div>
    )
}