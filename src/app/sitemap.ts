export default function sitemap() {
    const baseUrl = 'https://ruthcloud.xyz';
    const currentDate = new Date().toISOString();

    const routes = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        }
    ];

    return routes;
}