export function convertAvatar2Base64(url: string, width = 100, height = 100): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'annoymous';
        image.src = url;
        let canvas = document.createElement("canvas");
        canvas.height = width;
        canvas.width = height;
        const ctx = canvas.getContext("2d");
        try {
            image.onload = () => {
                ctx.drawImage(image, 0, 0, width, height);
                resolve(canvas.toDataURL("image/"));
                canvas = null;
            }
        } catch{
            reject("");
        }
    });
}