import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Link } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

import { Button } from '../components/Button'
import { FormEvent, useState } from 'react'
import { createRoom } from '../services/firebase'
import { useNavigate } from 'react-router-dom'

export function NewRoom() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [ newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault()
        if(newRoom.trim() === ''){
            return alert("Insira um nome de sala válido")
        }

        const roomInfo = {
            title: newRoom,
            authorId: user?.id
        }

        const roomId = await createRoom(roomInfo)
        setNewRoom('')
        navigate(`/rooms/${roomId}`)
    }

    return ( 
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="ilustracao simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    
                    <img src={logoImg} alt="Letmeask"/>
                    <h1>{user?.name}</h1>  
                    <h2>Criar uma nova sala</h2>
                    <form action="" onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}/>

                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique Aqui</Link>
                    </p>
                </div>
            </main>
        </div>

    )
} 