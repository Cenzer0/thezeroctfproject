import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || 'changeme',
      clientSecret: process.env.GITHUB_SECRET || 'changeme',
    }),
  ],
});

export { handler as GET, handler as POST };
