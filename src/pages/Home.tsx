import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'


import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { IsJoinableRoom } from '../services/firebase'

export function Home() {
    
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault()
        
        if(roomCode.trim() === ""){
            return alert('O código da sala nao pode ser vazio!')
        }

        if(! await IsJoinableRoom(roomCode)){
            return alert("Por favor informe um código de sala válido")
        }
        navigate('/rooms/' + roomCode)
    }
    
    async function handleCreateRoom(){

        if(!user){
            await signInWithGoogle()
        }
        navigate("/rooms")
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
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator"> ou entre em uma sala</div>
                    <form action="" onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código"
                            onChange={event => {setRoomCode(event.target.value)}}
                            />

                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>

    )
} 