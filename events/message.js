const userDB = require('../database/users')

module.exports = async (client, message) => {

  if (message.author.bot) return
  //message.author.data = await userDB.forceUser(message.author.id)

  client.commands.get('automod').run(client, message)
  //client.commands.get('handlepoints').run(client, message)

  if(client.config.allowMentionPrefix) message.content = message.content.replace(new RegExp(`^<@!?${client.user.id}> `), client.config.prefix)

  if (!message.content.startsWith(client.config.prefix)) return

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command) || client.commands.find(c => c.config.aliases && c.config.aliases.includes(command))
  if (!cmd) return

  if(cmd.config.guildOnly && !message.guild) return
  if(cmd.config.ownerOnly && !client.config.owners.includes(message.author.id)) return

  if(cmd.config.modOnly && !message.member.roles.some(r=>client.serverconfig.mod_roles.includes(r.id))) return

  try {
    await cmd.run(client, message, args)
  } catch (error) {
    console.error(error)
    message.channel.send(':x: Something went wrong while executing the command').catch(console.error)
  }
}
