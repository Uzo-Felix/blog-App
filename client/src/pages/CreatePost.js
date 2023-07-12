import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from 'react';
import {Navigate} from 'react-router-dom';

const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    async function createNewPost(event){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0])
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        })
        if(response.ok){
            setRedirect(true);
        }

    }
    if(redirect){
        return <Navigate to={'/'} />;
    }
   
    return (
        <form onSubmit={createNewPost}>
            <input type='title' 
                placeholder={'Title'}
                value={title}
                onChange={event => setTitle(event.target.value)}
                />
            <input type='summary' 
                placeholder={'Summary'}
                value={summary}
                onChange={event => setSummary(event.target.value)}/>
            <input type='file'
                // value={files}
                onChange={event => setFiles(event.target.files)}
                />
            <ReactQuill  
                value={content}
                onChange={newValue => setContent(newValue)}
                modules={modules}/>
            <button style={{marginTop: '5px'}}>Create post</button>
        </form>
    )
}