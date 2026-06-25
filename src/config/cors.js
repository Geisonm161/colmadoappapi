export function corsOptions() {
  const clientUrls = (process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://colmado-app.vercel.app',
    ...clientUrls
  ].filter(Boolean);

  return {
    origin(origin, callback) {
      const normalizedOrigin = origin?.replace(/\/$/, '');
      const isAllowedVercelPreview = normalizedOrigin && /^https:\/\/colmado-app-[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin);

      if (!origin || allowedOrigins.includes(normalizedOrigin) || isAllowedVercelPreview) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  };
}
