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
      isHighlighted:boolean,
      likeCount: number,
      likeId: string | undefined
}

export function useRoom (roomId:string | undefined, handle?:any, userId?: string | undefined){
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [roomTitle, setRoomTitle] = useState("")

    useEffect(() => {
            GetQuestions(roomId,(arrayQuestions:QuestionType[], title:string) => {
            setQuestions(arrayQuestions)
            setRoomTitle(title)
        },userId)

    }, [roomId, handle, userId])

    return { questions, roomTitle }
}