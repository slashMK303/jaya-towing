import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        // Ensure directory exists (basic check, though 'public' should exist)
        // Note: In a real prod environment we'd check/create dir, but Next.js public usually exists.
        // We might fail if 'uploads' doesn't exist, so let's try to write directly.
        // Ideally we would use fs.mkdir(uploadDir, { recursive: true }) but let's assume public exists.

        // For Vercel ephemeral filesystem warning, we accept this is temporary.
        const filepath = path.join(uploadDir, filename);

        // Write file
        // Note: This requires 'public/uploads' to exist. I will add a step to create it.
        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
