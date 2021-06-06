import { DatabaseName, RepositoryFactory } from './repository.factory';

export class DbMigration {
  async migrate(from: DatabaseName, to: DatabaseName) {
    const sourceDatabase = RepositoryFactory.createRepoConnection(from);
    const targetDatabase = RepositoryFactory.createRepoConnection(to);
    try {
      const domains = await sourceDatabase.list();
      await Promise.all(domains.map((d) => targetDatabase.save(d)));
    } finally {
      sourceDatabase.dispose();
      targetDatabase.dispose();
    }
  }
}
