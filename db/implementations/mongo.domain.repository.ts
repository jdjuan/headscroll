import { DomainMap } from '../domain.model';
import { IDomainRepository } from '../idomain.repository';
import { MongoClient } from 'mongodb';

export class MongoDomainRepository implements IDomainRepository {
  private user = process.env.DB_MONGO_USER;
  private password = process.env.DB_MONGO_PASSWORD;
  private dbName = process.env.DB_NAME;
  private connectionString = `mongodb+srv://${this.user}:${this.password}@cluster0.ppc5z.mongodb.net/${this.dbName}?retryWrites=true;`;
  private collectionName = `${process.env.VERCEL_ENV}-domains`;

  private client: MongoClient = new MongoClient(this.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  async dispose(): Promise<void> {
    try {
      if (this.client && this.client.isConnected()) {
        await this.client.close();
      }
    } catch (error) {
      console.error(`Error closing the db ${error}`);
    } finally {
      this.client = null;
    }
  }

  private getDb = async () => {
    if (!this.client) {
      this.client = new MongoClient(this.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    return this.client.db();
  };

  private getCollection = async () => {
    return (await this.getDb()).collection<DomainMap>(this.collectionName);
  };

  async get(id: string) {
    const collection = await this.getCollection();
    const domainMap = await collection.findOne({ id });
    return DomainMap.fromDb(domainMap);
  }

  async save(domainMap: DomainMap) {
    const collection = await this.getCollection();
    await collection.updateOne({ id: domainMap.id }, { $set: domainMap }, { upsert: true });
    return domainMap;
  }

  async list(query: Partial<DomainMap> = {}) {
    const collection = await this.getCollection();
    const findResult = await collection.find(query);
    return findResult.map((r) => DomainMap.fromDb(r)).toArray();
  }

  async findByDomain(domainMap: Pick<DomainMap, 'domain' | 'protocol'>) {
    const collection = await this.getCollection();
    const findResult = await collection.findOne(domainMap);

    if (findResult) {
      return DomainMap.fromDb(findResult);
    } else {
      return null;
    }
  }
}
