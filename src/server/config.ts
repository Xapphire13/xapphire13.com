export default {
  githubToken(): string | undefined {
    return process.env.GITHUB_TOKEN;
  },

  mongoDbConnectionString(): string {
    const connectionString = process.env.MONGODB_URI;

    if (connectionString == null) {
      throw new Error("Can't get mongo connection URI");
    }
    return connectionString;
  }
};
