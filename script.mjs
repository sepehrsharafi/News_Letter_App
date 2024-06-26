import { MailtrapClient } from "mailtrap";
import Parser from "rss-parser";
import dotenv from "dotenv";

dotenv.config();

const RSS_FEED_URL = process.env.RSS_FEED_URL;
const token = process.env.TOKEN;

let targetData = {};

let parser = new Parser();

async function get_Data() {
  let feed = await parser.parseURL(RSS_FEED_URL);
  // console.log(feed);
  const TOKEN = token;
  const ENDPOINT = "https://send.api.mailtrap.io/";

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Mailtrap Test",
  };
  const recipients = [
    {
      email: "sepehr.sharafi.edu@gmail.com",
    },
  ];

  feed.items.forEach((item) => {
    if (item.title.includes("Middle East")) {
      targetData.title = item.title;
      targetData.publisher = item.creator;
      targetData.pubDate = item.pubDate;
      targetData.description = item.content;
      targetData.link = item.link;
    }
  });

  client
    .send({
      from: sender,
      to: recipients,
      subject: "You have NEWS!!!",
      html: `<div style="border: 1px solid #ddd; border-radius:8px; margin-bottom: 20px; padding: 20px 15px;">
      <p style="font-size: 22px; font-weight: 600; margin: 0 0 10px 0;"><a href="" style="text-decoration: none; color: #0073e6;">${targetData.title}</a></p>
      <p style="margin: 0; font-size: 14px; font-weight: 400; margin-bottom:5px;"><strong>Publisher:${targetData.publisher}</strong> </p>
      <p style="margin: 0; font-size: 14px; font-weight: 400;"><strong>Published:${targetData.pubDate}</strong> </p>
      <div style="margin-top: 10px;">
          <p style="margin: 0; font-size: 18px;">${targetData.description}</p>
      </div>
      <div style="text-align: center; margin-top:20px;">
          <a href="${targetData.link}" style="background-color: #0073e6; color: white; padding: 10px 12px; text-decoration: none; border-radius: 4px; display: inline-block; font-size: 16px; font-weight: 600;
          ">Read more</a>
      </div>
    </div>`,
      category: "Integration Test",
    })
    .then(console.log)
    .catch(console.error);
}

get_Data();
