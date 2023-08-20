function PictureMessageLeft({ imgUri }: { imgUri: string }) {
    return (
        <img
            loading="lazy"
            alt="picture"
            src={imgUri}
            className="w-1/2 me-auto my-3 rounded-2xl border border-solid border-color"
        />
    );
}

export default PictureMessageLeft;
