import routes from './routes';
import DefaultLayout from './views/layouts/Default';
import { Routes, Route } from 'react-router-dom';
import '~/utils/functions/chatOnline';

function App() {
    return (
        <DefaultLayout>
            <Routes>
                {routes.map((route) => {
                    const Page = route.component;
                    return <Route path={route.path} key={route.path} element={<Page />} />;
                })}
            </Routes>
        </DefaultLayout>
    );
}

export default App;
