import { Client, Guild, MessageEmbed, TextChannel } from 'discord.js';
import moment from 'moment';
import { primaryColor } from '../../settings';

export const updateStats = async (client: Client, guild: Guild) => {
    const settings = await guild.settings();
    const antiRaidSettings = await guild.antiraid();
    const embed = new MessageEmbed()
        .setAuthor(guild.name, guild.iconURL({ dynamic: true }) || '')
        .setTitle('📈 Guild Analytics (DEV)')
        .setDescription(
            'Here is your Guild Analytics This will contain stats about your guild, active member and staff as well as amount of messages being send and more (with graphs that are coming soon)'
        )
        .setColor(primaryColor)
        .addField(
            `AntiRaid Protection Status`,
            `${
                antiRaidSettings.lockdown
                    ? '✅ Under Lockdown'
                    : '❌ Not in Lockdown'
            }\n${
                antiRaidSettings.inviteWipe
                    ? '✅ Invite Wipe Enabled'
                    : '❌ Invite Wipes Disabled'
            }\n ${
                antiRaidSettings.welcomeGate
                    ? '✅ Welcome Gate Enabled'
                    : '❌ Welcome Gate Disabled'
            }\n ${
                antiRaidSettings.antispamScore
                    ? '✅ AntiSpam Indefinite Mutes Enabled'
                    : '❌ AntiSpam Indefinite Mutes Disabled'
            }`
        )
        .addField(`Messages sent in 24 hours`, settings.messagesSent24hr)
        .setFooter(
            `These Stats Updates Every 10 Minute, Last Updated: ${moment(
                Date.now()
            ).format('LLLL')}`
        );

    const statsChan = <TextChannel>(
        guild.channels.cache.get(settings.statsChannel)
    );
    if (statsChan && statsChan.messages.fetch(settings.statsMessage)) {
        statsChan.messages.fetch(settings.statsMessage).then((msg) => {
            msg.edit('', { embed });
        });
    }
};
