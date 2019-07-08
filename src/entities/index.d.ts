declare namespace Xapphire13 {
  export namespace Entities {
    export interface Experiment {
      name: string;
      description: string;
      main: string;
    }

    export interface Log {
      timestamp: string;
      level: number;
      message: string;
      exception?: string;
    }

    export interface Post {
      id: string;
      title: string;
      created: string;
      lastModified: string;
      markdownText: string;
      tags: string[];
      isPublished: boolean;
    }

    export interface User {
      id: number;
      username: string;
      name: string;
      passwordHash: string;
      tokenSecret: string;
      authenticatorSecret: string;
    }

    export interface Page<T = any> {
      values: T[];
      continuationToken: string | null;
    }
  }
}
