import { ROUTE, TAGS, API } from "../../../constants";

export const get = (builder) => {
  return builder.query({
    query: () => `${ROUTE.USERS_ROUTE}`,
    method: API.GET,
    providesTags: [TAGS.USERS],
  });
};

export const getById = (builder) => {
  return builder.query({
    query: (id) => `${ROUTE.USER_ID_ROUTE.replace(":id", id)}`,
    method: API.GET,
    providesTags: [TAGS.USERS],
  });
};

export const add = (builder) => {
  return builder.mutation({
    query: (payload) => ({
      url: `${ROUTE.USERS_ROUTE}`,
      method: API.POST,
      body: payload,
    }),
    invalidatesTags: [TAGS.USERS],
  });
};

export const updateById = (builder) => {
  return builder.mutation({
    query: ({ id, payload }) => {
      return {
        url: `${ROUTE.EDIT_USER_ID.replace(":id", id)}`,
        method: API.PATCH,
        body: payload,
      };
    },
    invalidatesTags: [TAGS.USERS],
  });
};

export const deleteById = (builder) => {
  return builder.mutation({
    query: (id) => ({
      url: `${ROUTE.USER_ID_ROUTE.replace(":id", id)}`,
      method: API.DELETE,
    }),
    invalidatesTags: [TAGS.USERS],
  });
};

export const updatePasswordById = (builder) => {
  return builder.mutation({
    query: ({ id, oldPassword, newPassword, confirmPassword }) => {
      return {
        url: `${ROUTE.UPDATE_PASSWORD.replace(":id", id)}`,
        method: API.PATCH,
        body: { oldPassword, newPassword, confirmPassword },
      };
    },
    invalidatesTags: [TAGS.USERS],
  });
};

export const forgotPassword = (builder) => {
  return builder.mutation({
    query: (email) => ({
      url: `${ROUTE.FORGOT_PASSWORD}`,
      method: API.PUT,
      body: { email },
    }),
  });
};

export const resetPassword = (builder) => {
  return builder.mutation({
    query: ({ resetToken, newPassword, confirmPassword, email }) => {
      return {
        url: `${ROUTE.RESET_PASSWORD}?email=${encodeURIComponent(email)}`,
        method: API.POST,
        body: { resetToken, newPassword, confirmPassword },
      };
    },
    invalidatesTags: [TAGS.USERS],
  });
};

export default {
  get,
  getById,
  add,
  updateById,
  deleteById,
  forgotPassword,
  resetPassword,
  updatePasswordById,
};
