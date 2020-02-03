export default {
  GRAPH_ENDPOINT:
    process.env.env === 'production'
      ? 'https://xapphire13.herokuapp.com/graphql'
      : `http://${window.location.host}/graphql`
};
