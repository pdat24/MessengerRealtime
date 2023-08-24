import { useEffect, useState } from 'react';
import ImageModel from './ImageModel';
import ProfileModel from './ProfileModel';
import FileModel from './FileModel';

enum ModelName {
    profile,
    image,
    file,
}

function Profile() {
    const [show, setShow] = useState(true);
    const [activeModel, setActiveModel] = useState(ModelName.profile);
    const models = {
        [ModelName.profile]: <ProfileModel />,
        [ModelName.image]: <ImageModel />,
        [ModelName.file]: <FileModel />,
    };

    useEffect(() => {
        const toggleProfileHandler = () => setShow((prevValue) => !prevValue);
        window.addEventListener('toggleProfile', toggleProfileHandler);
        window.addEventListener('changeModel', (e: CustomEventInit) => {
            if (e.detail === 'profile') setActiveModel(ModelName.profile);
            else if (e.detail === 'image') setActiveModel(ModelName.image);
            else if (e.detail === 'file') setActiveModel(ModelName.file);
        });

        return () => window.removeEventListener('toggleProfile', toggleProfileHandler);
    }, []);

    return show && models[activeModel];
}

export default Profile;
