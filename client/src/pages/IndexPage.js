import Post from "../Post";
import Loading from "../Loading";
import {useEffect, useState} from 'react';

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`api/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts);
                setLoading(false);
            });
        });
    }, []);
    return (
        <>
            {loading ? (<Loading />): (
            <>
                {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
                ))}
            </>
            )}
        </>
    );
}