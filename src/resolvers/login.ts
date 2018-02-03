export const defaults = {
  visibilityFilter: 'SHOW_ALL',
  profiles: [],
}

export const resolvers = {
  Mutation: {
    visibilityFilter: (_, { filter }, { cache }) => {
      cache.writeData({ data: { visibilityFilter: filter } });
      return null;
    },
    addTodo: (_, { text }, { cache }) => {
      const query = gql`
        query GetProfiles {
          todos @client {
            id
            currency
            name
            available
            held
            total
            exchageRate
            BTCValue
          }
        }
      `;
      const previous = cache.readQuery({ query });
      const newAccount = {
        id: newAccountId++,
        currency,
        name,
        available,
        held,
        total,
        exchageRate,
        BTCValue,
        __typename: 'PortfolioItem',
      };
      const data = {
        todos: previous.todos.concat([newAccount]),
      };
      cache.writeData({ data });
      return newAccount;
    },
  }
}
