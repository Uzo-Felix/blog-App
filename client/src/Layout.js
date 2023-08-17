import Header from './Header';
import {Outlet} from 'react-router-dom';

export default function Layout(){
    return (
        <main>
            <div className='header-wrapper'>
            <Header />
            </div>
            <div className='outlet-wrapper'>
            <Outlet />
            </div>
        </main>
        
    );
}