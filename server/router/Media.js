const express = require("express");
const dataSources = require("../dataSources/DataSources");
const { default: Axios } = require("axios");
const mediaRouter = express.Router();

mediaRouter.get("/trending", async (req, res) => {
  const { category } = req.query;
  const creators = await dataSources.mongoClient.getAllCreators();
  if (category === 'All') {
    res.send(creators)
  } else {
    const streamNames = category
      ? await dataSources.twitchAPI.getTrendingByCategory(category)
      : await dataSources.twitchAPI.getTrending();
    res.send(creators.filter((c) => streamNames.find(n => n === c.twitch)))
  }
});

mediaRouter.get("/channel/:id", async (req, res) => {
  const { id } = req.params;
  res.send(await dataSources.getCreatorLinksByid(id))
});

module.exports = mediaRouter
