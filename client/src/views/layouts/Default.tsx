import { ReactElement } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';

function DefaultLayout({ children }: { children: ReactElement }) {
    return (
        <div className="flex">
            <div className="flex">
                <Sidebar />
                <Chat />
            </div>
            <div className="flex-grow">{children}</div>
        </div>
    );
}

export default DefaultLayout;
