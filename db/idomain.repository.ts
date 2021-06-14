import { DomainMap } from './domain.model';

export interface IDomainRepository {
  get(id: string): Promise<DomainMap>;
  save(domainMap: DomainMap): Promise<DomainMap>;
  list(query?: Partial<DomainMap>): Promise<DomainMap[]>;
  findByDomain(domainMap: Pick<DomainMap, 'domain' | 'protocol'>): Promise<DomainMap>;
  dispose(): Promise<void>;
}
