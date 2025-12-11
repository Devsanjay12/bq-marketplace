import sharp from "sharp";

export async function optimizeImage(buffer: Buffer, width: number = 800, quality: number = 80): Promise<Buffer> {
    return await sharp(buffer)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
}

export async function optimizeLogo(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
        .resize(512, 512, { fit: "cover" })
        .webp({ quality: 90 })
        .toBuffer();
}
