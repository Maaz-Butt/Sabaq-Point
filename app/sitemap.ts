import { MetadataRoute } from 'next';
import { getBoards } from '@/actions/board';
import { getPapers } from '@/actions/paper';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sabaqpoint.com';
  
  // 1. Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/past-papers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // 2. Fetch Boards
  const boardsRes = await getBoards();
  const boards = boardsRes.success && boardsRes.data ? boardsRes.data : [];
  
  const boardRoutes = boards.map((board: any) => ({
    url: `${baseUrl}/past-papers/${board.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Fetch Papers to extract Classes, Subjects, and Papers
  const papersRes = await getPapers({ limit: 5000 });
  const papers = papersRes.success && papersRes.data ? papersRes.data : [];

  // Map of boards for quick slug lookup
  const boardsMap: Record<string, string> = {};
  boards.forEach((b: any) => {
    boardsMap[b.$id] = b.slug;
  });

  const classRoutesSet = new Set<string>();
  const subjectRoutesSet = new Set<string>();
  const paperRoutes: any[] = [];

  papers.forEach((paper: any) => {
    const boardSlug = boardsMap[paper.boardId];
    if (!boardSlug) return;

    const classParam = encodeURIComponent(paper.classLevel);
    const subjectParam = encodeURIComponent(paper.subject.toLowerCase());

    // Class Route
    classRoutesSet.add(`${baseUrl}/past-papers/${boardSlug}/${classParam}`);

    // Subject Route
    subjectRoutesSet.add(`${baseUrl}/past-papers/${boardSlug}/${classParam}/${subjectParam}`);

    // Paper view Route
    paperRoutes.push({
      url: `${baseUrl}/past-papers/view/${paper.$id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  });

  const classRoutes = Array.from(classRoutesSet).map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const subjectRoutes = Array.from(subjectRoutesSet).map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...boardRoutes,
    ...classRoutes,
    ...subjectRoutes,
    ...paperRoutes,
  ];
}
