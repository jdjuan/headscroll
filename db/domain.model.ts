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

  static Create(data: Pick<DomainMap, 'domain' | 'protocol'> & Partial<DomainMap>): DomainMap {
    return new DomainMap(data);
  }

  private constructor(data: Partial<DomainMap>) {
    this.id = data.id;
    this.domain = data.domain;
    this.protocol = data.protocol ?? 'https';
    this.state = data.state ?? DomainState.Pending;
    this.requests = data.requests ?? 1;
  }

  incrementRequests() {
    this.requests++;
  }

  update(newValues: Partial<DomainMap>) {
    Object.assign(this, newValues);
  }

  updateState(newState: DomainState) {
    this.state = newState;
  }
}

export enum DomainState {
  Approved = 'Approved',
  Denied = 'Denied',
  Pending = 'Pending',
  Limited = 'Limited',
}
