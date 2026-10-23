'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
});
