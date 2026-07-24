export type ActivityItem = {
  type: 'project' | 'post';
  title: string;
  description: string;
  date: Date;
  url: string;
  label: string;
};

type ProjectEntry = {
  id: string;
  data: { title: string; description: string; date: Date; categories: string[] };
};

type PostEntry = {
  id: string;
  data: { title: string; description: string; date: Date };
};

export function buildActivity(
  projects: ProjectEntry[],
  posts: PostEntry[],
  limit = 8,
): ActivityItem[] {
  const items: ActivityItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      url: `/projects/${p.id}/`,
      label: p.data.categories[0],
    })),
    ...posts.map((p) => ({
      type: 'post' as const,
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      url: `/writing/${p.id}/`,
      label: 'writing',
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
