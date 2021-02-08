import { CosmosClient, Database } from '@azure/cosmos';
import { DomainMap } from './domain.model';

export class DomainRepository {
  private endpoint = process.env.DB_ENDPOINT;
  private key = process.env.DB_KEY;
  private dbName = process.env.DB_NAME;
  private containerName = `${process.env.VERCEL_ENV}-domains`;

  private db: Database;

  private getContainer = async () => {
    const { container } = await this.db.containers.createIfNotExists({
      id: this.containerName,
    });

    return container;
  };

  constructor() {
    const client = new CosmosClient({ endpoint: this.endpoint, key: this.key });
    this.db = client.database(this.dbName);
  }

  async get(id: string) {
    const container = await this.getContainer();
    const domainMap = await container.item(id).read<DomainMap>();
    return DomainMap.fromDb(domainMap.resource);
  }

  async save(domainMap: DomainMap) {
    const container = await this.getContainer();
    const createdDomain = await container.items.upsert<DomainMap>(domainMap);
    return createdDomain.resource;
  }

  async list(query: Partial<DomainMap> = {}) {
    const queryKeys = Object.entries(query).filter(([, value]) => value);
    const whereParameters = queryKeys.map(([key]) => `c.${key} = @${key}`);
    const whereClause = `WHERE ${whereParameters.join(' AND ')}`;
    const sqlQuery = `SELECT * from c ${whereParameters.length > 0 ? whereClause : ''}`;
    const parameters = queryKeys.map(([key, value]) => ({ name: `@${key}`, value: value.toString() }));

    const container = await this.getContainer();
    const { resources } = await container.items
      .query<DomainMap>({
        query: sqlQuery,
        parameters,
      })
      .fetchAll();

    return resources.map((r) => DomainMap.fromDb(r));
  }

  async findByDomain(domainMap: Pick<DomainMap, 'domain' | 'protocol'>) {
    const container = await this.getContainer();
    const { resources } = await container.items
      .query<DomainMap>({
        query: 'SELECT * from c WHERE c.domain = @domain AND c.protocol = @protocol ',
        parameters: [
          { name: '@domain', value: domainMap.domain },
          { name: '@protocol', value: domainMap.protocol },
        ],
      })
      .fetchAll();

    if (resources.length > 0) {
      return DomainMap.fromDb(resources[0]);
    } else {
      return null;
    }
  }
}
