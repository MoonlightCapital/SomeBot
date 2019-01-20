module.exports = async (client, packet) => {

  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return

  const channel = client.channels.get(packet.d.channel_id)

  if (channel.messages.has(packet.d.message_id)) return

  channel.fetchMessage(packet.d.message_id).then(async message => {

      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name

      const reaction = message.reactions.get(emoji)

      if (packet.t === 'MESSAGE_REACTION_ADD') {
          client.emit('messageReactionAdd', reaction, await client.fetchUser(packet.d.user_id))
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
          client.emit('messageReactionRemove', reaction, await client.fetchUser(packet.d.user_id))
      }
  })
}
