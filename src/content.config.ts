// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const events = defineCollection({
	loader: file('src/data/events.json'),
	schema: z
		.object({
			slug: z.string().min(1),
			title: z.string().min(1),
			dateStart: z.string().datetime(),
			dateEnd: z.string().datetime(),
			price: z.string().regex(/^\d+(\.\d{2})?$/),
			players: z.number().int().positive(),
			kind: z.string(),
			tags: z.array(z.string()),
			description: z.string(),
			rules: z.array(z.string()).min(1),
			image: z.string().url(),
		})
		.refine((data) => new Date(data.dateEnd) > new Date(data.dateStart), {
			message: 'End date must be after start date',
			path: ['dateEnd'],
		}),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { events };
