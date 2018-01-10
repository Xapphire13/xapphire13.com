declare module "sql-tagged-template-literal" {
  function sqlTag(queryParts: TemplateStringsArray, ...values: any[]): string;

  export = sqlTag;
}
