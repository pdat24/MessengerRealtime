const getFilename = (fileUrl: string) => {
    return fileUrl.split('_')[1];
};

export default getFilename;
