// Import the functions you need from the SDKs you need
import { initializeApp }  from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'
import * as Data from 'firebase/database'
import { onValue } from "firebase/database";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
 };

type RoomInfoType = {
  title:string,
  authorId:string|undefined;
}

type QuestionType = {
  content:string,
  author: {
      name:string,
      avatar:string,
  },
  isHighlighted:boolean,
  isAnswered:boolean
}

type FirebaseQuestionsType = Record<string, {
  author: {
    name:string,
    avatar: string;
  }
  content: string,
  isAnswered:boolean,
  isHighlighted:boolean
}>

export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = Data.getDatabase()
const ref = Data.ref
const push = Data.push
const set = Data.set
const get = Data.get
const child = Data.child


const roomRef = ref(db,'rooms') //Referencia a lista de salas

export async function createRoom(romInfo:RoomInfoType){
  const newRoomRef = await push(roomRef) //Referencia a sala dentro da lista
  set(newRoomRef, romInfo)

  return newRoomRef.key
}

export async function IsJoinableRoom(roomId:string){
  const isRoom = await get(child(roomRef, roomId))
  return isRoom.exists()
}

export async function CreateNewQuestion(question:QuestionType, roomId:string | undefined){
  const specificRoomRef = ref(db,'rooms/' + roomId + '/questions')
  await push(specificRoomRef, question)
}

export async function GetQuestions(roomId:string | undefined, hookForQuestions: any){
  const questionsRef = ref(db, 'rooms/'+ roomId  + '/questions')
  const thisRoom = await get(child(ref(db), "rooms/" + roomId))

  onValue(questionsRef, (questions) => {
    
    const firebaseQuestions:FirebaseQuestionsType = questions.val()
    const isParseableQuestions = firebaseQuestions !== null 
    let usableParsedQuestions;

    if(isParseableQuestions){
    let parsedQuestions = Object.entries(firebaseQuestions)
    
    usableParsedQuestions = parsedQuestions.map(([key, value]) => {
      return {
        id: key,
        content: value.content,
        author: value.author,
        isHighlighted: value.isHighlighted,
        isAnswered: value.isAnswered,
      }})} 
    
    hookForQuestions(isParseableQuestions && usableParsedQuestions, thisRoom.val().title)
    
  },{
    onlyOnce: true
  })
}




