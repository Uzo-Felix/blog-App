import {formatISO9075} from 'date-fns';

export default function Post({_id, title, summary,cover, content, createdAt, author}){
    return (
        <div className="post">
            <div className="image">
                <img src={'http://localhost:4000/'+cover} alt=""/>
            </div>
            <div className="texts"> 
                <h2>{title}</h2>
                <p className="info">
                    {/* <a className="author">{author}</a> */}
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
