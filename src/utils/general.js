function getNovelName(novel_url) {
  let novel_name = '';

  const siteName = getSiteName(novel_url);
  if (["riwyat", "novelbin", "rewayat", "sunovels", "ar-novel", 'webnovel'].includes(siteName)) {
    novel_name = novel_url[4].replaceAll("-", " ");
  } else if (["kolnovel"].includes(siteName)) {
    let novel_url_name = novel_url.at(-2).split("-");
    novel_url_name.pop();
    novel_name = novel_url_name.join(" ");
  } else if (["mtlnovel"].includes(siteName)) {
    novel_name = novel_url[3].replaceAll("-", " ");
  } else if ((novel_url[0] == "file:")) {
    novel_name = novel_url[novel_url.length - 2].replaceAll("-", " ");
  }
  novel_name = {
    "semperors dominationz": "emperors domination",
    "%d8%a7%d9%84%d8%b3%d8%b9%d9%8a-%d9%88%d8%b1%d8%a7%d8%a1-%d8%a7%d9%84%d8%ad%d9%82%d9%8a%d9%82%d8%a9": "spursuit of the truthz",
    "i can copy the talent": "your talent-is-mine",
    "spursuit of the truthz": "pursuit of the truth"
  }?.[novel_name] || novel_name;
  console.log('Kolnovels Extention ✅', { novel_name, novel_url, siteName });
  return novel_name;
}

function getSiteName(novel_url) {
  return novel_url[2].replaceAll("www.", "").split(".").slice(0, -1).join(".");
}