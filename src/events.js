import { WebClient } from '@slack/client'

const eventResponses = {
  'emoji_changed': async (event, client) => {
    if (event.subtype !== "add") { return null }
    return client.chat.postMessage({
      channel: 'random',
      text: `emoji_added: :${event.name}:`,
    })
  },
  'team_join': async (event, client) => {
    return client.chat.postMessage({
      channel: 'random',
      text: `user_added: <@${event.user.id}>`,
    })
  },
  'channel_created': async (event, client) => {
    return client.chat.postMessage({
      channel: 'random',
      text: `channel_added: <#${event.channel.id}>`,
    })
  },
}

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const slackEvent = body.event
  console.log(JSON.stringify(body, null, 4))

  if (slackEvent && eventResponses[slackEvent.type]) {
    const webClient = new WebClient(process.env.SLACK_TOKEN)
    await eventResponses[slackEvent.type](slackEvent, webClient)
  }

  callback(null, {
    statusCode: 200,
    body: body.challenge
  })
}
