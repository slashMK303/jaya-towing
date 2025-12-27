import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            // Only allow if token exists (user is logged in)
            // You can add role checks here too, e.g., token.role === 'ADMIN'
            return !!token;
        },
    },
});

export const config = {
    matcher: ["/dashboard/:path*"],
};
