import sanityClient from '@sanity/client';
import ImageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'l3wt8ec6',
    dataset: 'production',
    apiVersion: '2023-01-06',
    useCdn: 'true',
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

const builder = ImageUrlBuilder(client);

export const urlFor = (source) => source && builder.image(source);
