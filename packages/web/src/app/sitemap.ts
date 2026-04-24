import type { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../lib/blog';
import { TOPICS } from '../lib/topics';
import { COMPETITORS } from '../lib/competitors';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gitleads.app';
  const now = new Date();

  const INTEGRATION_SLUGS = [
    'hubspot', 'slack', 'smartlead', 'instantly', 'lemlist',
    'apollo', 'clay', 'pipedrive', 'salesforce', 'zapier', 'n8n', 'make',
  ];

  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/use-cases`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/use-cases/b2b-saas-founders`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/use-cases/devrel-teams`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/use-cases/tech-recruiters`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/use-cases/growth-teams`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/docs`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/find`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/tools/profile-analyzer`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/integrations`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...INTEGRATION_SLUGS.map(slug => ({
      url: `${baseUrl}/integrations/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];

  // SEO blog posts
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Programmatic /find/[topic] pages
  const findPages: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${baseUrl}/find/${topic.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Competitor comparison /vs pages
  const vsPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/vs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...COMPETITORS.map((c) => ({
      url: `${baseUrl}/vs/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticPages, ...blogPages, ...findPages, ...vsPages];
}
