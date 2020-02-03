export default {
  GRAPH_ENDPOINT:
    process.env.NODE_ENV === 'production'
      ? 'https://xapphire13.herokuapp.com/graphql'
      : `http://${window.location.host}/graphql`
};
