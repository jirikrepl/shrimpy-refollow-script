// credits @Xcxooxl
require('dotenv').config();
const axios = require("axios");
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

const historyUrl = `https://www.shrimpy.io/shrimpy/leader_history?leaderRebalanceInfoId=${process.env.LEADER_ID}&userId=${process.env.USER_ID}`;
const stopFollowUrl = "https://www.shrimpy.io/shrimpy/portfolio_deactivate"
const followUrl = "https://www.shrimpy.io/shrimpy/follow_and_activate";

const cookieJar = new tough.CookieJar();
axiosCookieJarSupport(axios);
const cookie = tough.Cookie.parse(process.env.COOKIE);
cookieJar.setCookieSync(cookie,"https://www.shrimpy.io/");

const client = axios.create({
  jar: cookieJar,
  withCredentials: true
});

let lastHistoryItemUpdate;
const getLeaderHistory = () => {
  return client.get(historyUrl);
};

const stopFollowingLeader = () => {
  return client.post(stopFollowUrl, {
    userId: process.env.USER_ID,
    payload: { rebalanceInfoId: process.env.REBALANCE_INFO_ID , exchangeAccountId: process.env.EXCHANGE_ACCOUNT_ID },
  })
}

const followUser = () => {
  return client.post(followUrl, {
    userId: process.env.USER_ID,
    "payload": {
      "leaderRebalanceInfoId": process.env.LEADER_REBALANCE_INFO_ID,
      rebalanceInfoId: process.env.REBALANCE_INFO_ID,
      "stopFollowCurrency": "",
      "stopFollowAmountUsd": "0",
      "leaderBillingPlan": {
        "isAum": false,
        "aumPercent": "0",
        "isHwm": false,
        "hwmPercent": "0",
        "isFlat": false,
        "flatAmount": "0"
      }
    }
  })
}

async function checkLeaderAndUpdatePortfolio() {
  let history = await getLeaderHistory();
  let firstHistoryItem = history.data[0];
  let itemJson = JSON.stringify(firstHistoryItem);
  if (itemJson !== lastHistoryItemUpdate) {
    await stopFollowingLeader();
    await followUser();
    console.log('re-follow leader at:', new Date());
  }
  lastHistoryItemUpdate = itemJson;
}

setInterval(checkLeaderAndUpdatePortfolio,10000);
