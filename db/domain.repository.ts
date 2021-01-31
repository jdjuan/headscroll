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

  async list() {
    const container = await this.getContainer();
    const items = await container.items.readAll<DomainMap>().fetchAll();
    return items.resources.map((r) => DomainMap.fromDb(r));
  }

  async findByDomain(domain: string) {
    const container = await this.getContainer();
    const { resources } = await container.items
      .query<DomainMap>({
        query: 'SELECT * from c WHERE c.domain = @domain',
        parameters: [{ name: '@domain', value: domain }],
      })
      .fetchAll();

    if (resources.length > 0) {
      return DomainMap.fromDb(resources[0]);
    } else {
      return null;
    }
  }
}