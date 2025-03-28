import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'global',
  type: 'document',
  title: 'Global',
  icon: () => '🌍',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'tel',
      type: 'string',
      title: 'Phone number (optional)',
    }),
    defineField({
      name: 'socials',
      type: 'object',
      title: 'Social media',
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
        defineField({
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
          validation: Rule => Rule.uri({ scheme: ['https'] }).error('Provide a valid URL (starting with https://)'),
        }),
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'Global SEO',
      fields: [
        defineField({
          name: 'img',
          type: 'image',
          title: 'Social Share Image',
          description: 'Social Share Image is visible when sharing website on social media. The dimensions of the image should be 1200x630px. For maximum compatibility, use JPG or PNG formats, as WebP may not be supported everywhere.',
          validation: Rule => Rule.required()
        }),
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'OrganizationSchema',
      type: 'object',
      title: 'Organization structured data',
      description: (
        <>
          Learn more about{' '}
          <a
            href="https://developers.google.com/search/docs/appearance/structured-data/organization?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Organization structured data
          </a>
        </>
      ),
      options: { collapsible: true },
      fields: [
        defineField({
          name: 'name',
          type: 'string',
          title: 'Name',
          description: 'Enter the name of your organization as you want it to appear in search results.',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 3,
          title: 'Description',
          description: 'A brief description of your organization that will appear in search results.',
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      options: { collapsible: true },
      description: 'Configure analytics tracking tools to monitor page performance and user behavior. Leave fields empty to disable tracking.',
      fields: [
        defineField({
          name: 'gtm_id',
          type: 'string',
          title: 'Google Tag Manager ID',
          description: 'Format: GTM-XXXXXX. Container ID for managing analytics tools (GA4, Facebook Pixel, etc.).',
        }),
        defineField({
          name: 'meta_pixel_id',
          type: 'string',
          title: 'Meta (Facebook) Pixel ID',
          description: 'Format: XXXXXXXXXX. Used for Meta Pixel and Conversion API tracking.',
        }),
        defineField({
          name: 'meta_conversion_token',
          type: 'string',
          title: 'Meta Conversion API Token',
          description: 'Secret token for server-side Meta Conversion API tracking.',
        }),
        defineField({
          name: 'linkedin_conversion_token',
          type: 'string',
          title: 'LinkedIn Conversion API Token',
          description: 'Secret token for server-side LinkedIn Conversion API tracking.',
        }),
        defineField({
          name: 'tiktok_pixel_id',
          type: 'string',
          title: 'TikTok Pixel ID',
          description: 'Used for TikTok Pixel tracking.',
        }),
        defineField({
          name: 'tiktok_conversion_token',
          type: 'string',
          title: 'TikTok Conversion API Token',
          description: 'Secret token for server-side TikTok Conversion API tracking.',
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Global settings',
    })
  }
})

