import { CosmosDomainRepository } from './implementations/cosmos.domain.repository';
import { IDomainRepository } from './idomain.repository';
import { MongoDomainRepository } from './implementations/mongo.domain.repository';

export type DatabaseName = 'cosmos' | 'mongo';

export class RepositoryFactory {
  private static dbs = { cosmos: new CosmosDomainRepository(), mongo: new MongoDomainRepository() };

  static createRepoConnection(name?: DatabaseName): IDomainRepository {
    return this.dbs[name ?? process.env.DB_TYPE];
  }
}
