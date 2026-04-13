export const routes = {
  grammarPoints: {
    list: (jlptLevel?: string) =>
      jlptLevel ? `/grammar-points?jlpt_level=${jlptLevel}` : '/grammar-points',
    detail: (slug: string) => `/grammar-points/${slug}`,
  },
  sources: {
    list: (type?: string) => (type ? `/sources?type=${type}` : '/sources'),
    detail: (slug: string) => `/sources/${slug}`,
  },
  scenes: {
    list: () => '/scenes',
  },
};
