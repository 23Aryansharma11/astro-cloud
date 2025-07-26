import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
	const { ASTRO_CLOUD } = locals.runtime.env;

	try {
		const value = await ASTRO_CLOUD.get('testing');

		return new Response(JSON.stringify({ data: value }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to get value' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
};
