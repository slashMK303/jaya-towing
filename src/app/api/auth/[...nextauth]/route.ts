import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const nextAuthHandler = NextAuth(authOptions);

const handler = async (req: any, ctx: any) => {
    try {
        return await nextAuthHandler(req, ctx);
    } catch (error) {
        console.error("[NextAuth] Handler Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export { handler as GET, handler as POST };
