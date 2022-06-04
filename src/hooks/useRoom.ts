import { useEffect, useState } from "react";
import { GetQuestions } from "../services/firebase";

type QuestionType = {
    id: string;
    author: {
        name:string,
        avatar: string;
      }
      content: string,
      isAnswered:boolean,
      isHighlighted:boolean 
}

export function useRoom (roomId:string | undefined, handle:any){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [roomTitle, setRoomTitle] = useState("")

    useEffect(() => {
        GetQuestions(roomId,(arrayQuestions:QuestionType[], title:string) => {
            setQuestions(arrayQuestions)
            setRoomTitle(title)
        })

    }, [roomId, handle])

    return { questions, roomTitle }
}