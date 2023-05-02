import { ROUTE, TAGS, API } from '../../../constants'

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.CAMERAS_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.CAMERAS],
  })
}

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.CAMERA_ID_ROUTE.replace(':id', id)}`,
    method: API.GET,
    providesTags: [TAGS.CAMERAS],
  })
}

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.CAMERAS_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidatesTags: [TAGS.CAMERAS],
  })
}

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_CAMERA_ID.replace(':id', id)}`,
        method: API.PATCH,
        body: payload,
      }
    },
    invalidatesTags: [TAGS.CAMERAS],
  })
}

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.CAMERA_ID_ROUTE.replace(':id', id)}`,
      method: API.DELETE,
    }),
    invalidatesTags: [TAGS.CAMERAS],
  })
}

export default { get, getById, add, updateById, deleteById }
