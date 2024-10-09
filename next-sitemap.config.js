/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chatsaas.net',
  generateRobotsTxt: true, // 生成 robots.txt 文件
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', allow: ['/en/', '/zh/'] },
      { userAgent: '*', disallow: ['/en/dashboard/'] },
      { userAgent: '*', disallow: '/en/admin/' },
      { userAgent: '*', disallow: '/api/' },
      { userAgent: '*', disallow: '/en/demo/' },
    ],
    additionalSitemaps: [
      
    ],
  },
  exclude: ['/*/dashboard/*', '/*/admin/*', '/api/*', '/*/demo/*'], // 排除不需要出现在 sitemap 中的页面
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  outDir: './public',
  // 添加语言配置
  alternateRefs: [
    {
      href: 'https://chatsaas.net/en',
      hreflang: 'en',
    },
    // 未来可以添加其他语言，例如：
    // {
    //   href: 'https://chatsaas.net/zh',
    //   hreflang: 'zh-CN',
    // },
  ],
  // 使用 transform 函数来为每个 URL 添加语言标记
  transform: async (config, path) => {
    const url = new URL(path, config.siteUrl);
    return {
      loc: url.href,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
}