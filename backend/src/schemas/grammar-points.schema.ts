export const listGrammarPointsSchema = {
  querystring: {
    type: "object",
    properties: {
      jlpt_level: { type: "string", enum: ["N5", "N4", "N3", "N2", "N1", "Other"] },
      search: { type: "string", maxLength: 100 },
      page: { type: "string" },
      limit: { type: "string" },
    },
    additionalProperties: false,
  },
};
