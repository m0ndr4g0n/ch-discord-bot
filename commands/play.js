const { SlashCommandBuilder} = require('@discordjs/builders')
const { EmbedBuilder } = require ('discord.js')
const { QueryType } = require ('discord-player')


module.exports = {
    
    data: new SlashCommandBuilder()
    .setName("p")
    .setDescription("Escolha uma música, masqueico")
    .addSubcommand(subcommand => {
        return subcommand
            .setName("search")
            .setDescription("Peça uma música")
            .addStringOption(option => {
                return option
                    .setName("searchterms")
                    .setDescription("Procure por palavra chave")
                    .setRequired(true)
            })
    })
    .addSubcommand(subcommand => {
        return subcommand
            .setName("playlist")
            .setDescription("Playlist do youtube")
            .addStringOption(option => {
                return option
                    .setName("url")
                    .setDescription("link do youtube")
                    .setRequired(true)
            })
    }),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel){
            await interaction.reply("Entre em um canal de voz para tocar a música, Sr.Masqueico")
            return
        }

        const queue = await client.player.createQueue(interaction.guild)

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()
        if(interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString("url")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            })

            if (result.tracks.lenght === 0){
                await interaction.reply ("Não achei sua música men")
                return
            }

            const song = result.tracks
            await queue.addTracks(song)

            embed
                .setDescription(`Adicionei **[${song.title[0]}](${song.url[0]})** na queue`)
                .setThumbnail(song.thumbnail[0])
                .setFooter({text: `Duração: ${song.duration}`})
        }
        else if(interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            })

            if (result.tracks.length === 0){
                await interaction.reply("Não achei sua playlist men")
                return
            }

            const tracks = result.tracks
            await queue.addTracks(tracks)

            for (let i = 0; i < tracks.length; i++) {
                const track = tracks[i];
                embed
                    .setDescription(`Adicionei **[${track.title}](${track.url})** na queue`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({text: `Duração: ${track.duration}`});
            }
        }
        else if(interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("searchterms")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            })

            if (result.tracks.lenght === 0){
                await interaction.reply ("Não achei nada men")
                return
            }

            const song = result.tracks
            await queue.addTracks(song)

            embed
                .setDescription(`Adicionei **[${song[0].title}](${song[0].url})** na queue`)
                .setThumbnail(song[0].thumbnail)
                .setFooter({text: `Duração: ${song[0].duration}`})
        }

        if (!queue.playing) await queue.play()
        await interaction.reply({
            embeds: [embed]
        })
    }
}