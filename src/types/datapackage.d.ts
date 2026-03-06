declare module "datapackage" {
  export class Package {
    static load(
      descriptor: string | object,
      basePath?: string,
      strict?: boolean,
    ): Promise<Package>;
    descriptor: Record<string, unknown>;
    resources: Resource[];
    resourceNames: string[];
    getResource(name: string): Resource | null;
    valid: boolean;
    errors: Error[];
  }

  export class Resource {
    static load(
      descriptor: string | object,
      basePath?: string,
      strict?: boolean,
    ): Promise<Resource>;
    descriptor: Record<string, unknown>;
    name: string;
    tabular: boolean;
    headers: string[];
    read(options?: {
      keyed?: boolean;
      extended?: boolean;
      cast?: boolean;
      limit?: number;
    }): Promise<unknown[]>;
    valid: boolean;
    errors: Error[];
  }
}
