module.exports = {
  client: {
    service: {
      name: 'xapphire13',
      localSchemaFile: './src/server/schema.graphql'
    },
    includes: ['./src/client/**/*.ts', './src/client/**/*.tsx'],
    excludes: ['**/node_modules', '**/__generated__'],
    tagName: 'gql'
  }
};
