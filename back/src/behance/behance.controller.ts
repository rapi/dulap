import { Controller, Get, Inject } from '@nestjs/common';
import { BehanceService, Project } from './behance.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; // Import from 'cache-manager'

@Controller('behance')
export class BehanceController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly behanceService: BehanceService,
  ) {}

  @Get('projects')
  async getProjects(): Promise<Project[]> {
    const cached = await this.cacheManager.get<Project[]>('projects');
    if (cached) {
      return cached;
    }
    console.log('set cache');
    const response = await this.behanceService.getProjects();
    await this.cacheManager.set('projects', response, 60 * 60 * 1000); // ttl as a number

    return response;
  }
}
