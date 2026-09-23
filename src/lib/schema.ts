import { z } from 'zod';

export const ContentTypeSchema = z.enum([
  'skill',
  'tutorial',
  'presentation',
  'project',
  'note'
]);

export const VisibilitySchema = z.enum(['public', 'private', 'unlisted']);

export const StatusSchema = z.enum(['active', 'draft', 'archived', 'deprecated']);

export const ContentMetadataSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  type: ContentTypeSchema,
  category: z.string().min(1, 'Category is required'),
  summary: z.string().min(1, 'Summary is required'),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  version: z.string().default('1.0'),
  status: StatusSchema.default('active'),
  visibility: VisibilitySchema.default('public'),
  tags: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  cover: z.string().optional(),
  contentPath: z.string().optional(),
  repositoryUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  playUrl: z.string().optional(),
  featured: z.boolean().default(false),
  relatedSkills: z.array(z.string()).optional(),
  relatedProjects: z.array(z.string()).optional(),
  relatedPresentations: z.array(z.string()).optional(),
});

export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type Visibility = z.infer<typeof VisibilitySchema>;
export type Status = z.infer<typeof StatusSchema>;

export const SearchIndexItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: ContentTypeSchema,
  category: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  tools: z.array(z.string()),
  created: z.string(),
  updated: z.string(),
  url: z.string(),
  cover: z.string().optional(),
  featured: z.boolean().optional(),
});

export type SearchIndexItem = z.infer<typeof SearchIndexItemSchema>;
