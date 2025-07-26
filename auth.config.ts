import Google from '@auth/core/providers/google';
import { defineConfig } from 'auth-astro';

export default defineConfig({
	providers: [
		Google({
			clientId: import.meta.env.AUTH_GOOGLE_ID,
			clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	secret: import.meta.env.AUTH_SECRET,
	trustHost: true,
});
