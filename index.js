const axios = require("axios");
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const cookieJar = new tough.CookieJar();
axiosCookieJarSupport(axios);
let leader_id = "76473";
let myUserId = "XXXXXXXXXXXXXXXXXXXXXXXXXXX";
const historyUrl = `https://www.shrimpy.io/shrimpy/leader_history?leaderRebalanceInfoId=${leader_id}&userId=${myUserId}`;
const stopFollowUrl = "https://www.shrimpy.io/shrimpy/portfolio_deactivate"
const followUrl = "https://www.shrimpy.io/shrimpy//follow_and_activate";
const cookie = "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY";
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
    "userId": myUserId,
    "payload": {"rebalanceInfoId": XXXXXXXXX, "exchangeAccountId": "XXXXXXXXXXXXX"}
  })
}

const followUser = () => {
  return client.post(followUrl, {
    "userId": "XXXXXXXXXXXXXXXXXXXX",
    "payload": {
      "leaderRebalanceInfoId": leader_id,
      "rebalanceInfoId": XXXXXXXXXXX,
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
  }
  lastHistoryItemUpdate = itemJson;
}
setInterval(checkLeaderAndUpdatePortfolio,10000);
