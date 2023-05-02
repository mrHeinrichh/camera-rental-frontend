import { ROUTE, TAGS, API } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.TRANSACTIONS_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.TRANSACTIONS],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.TRANSACTION_ID_ROUTE.replace(":id", id)}`,
    method: API.GET,
    providesTags: [TAGS.TRANSACTIONS],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.TRANSACTIONS_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidatesTags: [TAGS.TRANSACTIONS],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_TRANSACTION_ID.replace(":id", id)}`,
        method: API.PATCH,
        body: payload,
      };
    },
    invalidatesTags: [TAGS.TRANSACTIONS],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.TRANSACTION_ID_ROUTE.replace(":id", id)}`,
      method: API.DELETE,
    }),
    invalidatesTags: [TAGS.TRANSACTIONS],
  });
};

export default { get, getById, add, updateById, deleteById };
