import { ReactNode } from 'react';
import '../styles/question.scss'
import cx from 'classnames'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
    children?: ReactNode
}

export function Question ({content, author, children, isHighlighted = false, isAnswered = false}:QuestionProps){
    return (
        <div className={cx(
            'question',
            {highlighted: isHighlighted && !isAnswered},
            {answered: isAnswered}
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>  
    )
}