export interface DomainMap {
  domain: string;
  protocol: string;
  state: DomainState;
  id?: string;
  requests: number;
}

export class DomainMap {
  static fromDb(domain: DomainMap): DomainMap {
    return new DomainMap(domain);
  }

  static Create(data: Pick<DomainMap, 'domain' & 'protocol'>): DomainMap {
    return new DomainMap(data);
  }

  private constructor(data: Partial<DomainMap>) {
    this.id = data.id;
    this.domain = data.domain;
    this.protocol = data.protocol ?? 'https';
    this.state = data.state ?? DomainState.InRevision;
    this.requests = data.requests ?? 1;
  }

  update(newValues: Pick<DomainMap, 'domain' | 'protocol'>) {
    this.requests++;
    Object.assign(this, newValues);
  }

  updateState(newState: DomainState) {
    this.state = newState;
  }
}

export enum DomainState {
  Approved = 'Approved',
  Dennied = 'Denied',
  InRevision = 'InRevision',
}
