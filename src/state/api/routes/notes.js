import { ROUTE, TAGS, API } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.NOTES_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.NOTES],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.NOTE_ID_ROUTE.replace(":id", id)}`,
    method: API.GET,
    providesTags: [TAGS.NOTES],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.NOTES_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidatesTags: [TAGS.NOTES],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_NOTE_ID.replace(":id", id)}`,
        method: API.PATCH,
        body: payload,
      };
    },
    invalidatesTags: [TAGS.NOTES],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.NOTE_ID_ROUTE.replace(":id", id)}`,
      method: API.DELETE,
    }),
    invalidatesTags: [TAGS.NOTES],
  });
};

export default { get, getById, add, updateById, deleteById };
