export const listSourcesSchema = {
  querystring: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["game", "anime", "movie", "series", "music"] },
    },
    additionalProperties: false,
  },
};
