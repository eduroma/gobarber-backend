import { container } from 'tsyringe'

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

import cacheConfig from '@config/cache';

const providers = {
  redis: container.resolve(RedisCacheProvider)
}

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  providers[cacheConfig.driver]
);
