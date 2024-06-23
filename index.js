const express = require('express')
const fetch = require('node-fetch')
const api = express()

api.use(require('cors')())

api.get('/', (req, res) => {
	res.redirect("https://lastestvideostats.gnzisepic777.repl.co/")
})

api.get('/:id', (req, res) => {

	let { id } = req.params;
	if (id.startsWith("UC")) id = id.replace("UC", "UU");
	fetch(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&playlistId=${id}&maxResults=1`).then((re) => re.json()).then((d) => {
		try {
			res.json({
				videoId: d.items[0].snippet.resourceId.videoId,
				title: d.items[0].snippet.title,
				dateUploaded: d.items[0].snippet.publishedAt
			})
		} catch(err) {
			console.error(err)
			return res.status(500).json({
				status: 500,
				error: "An interal error occured."
			})
		}
	})
})

api.get('/:id/videos', (req, res) => {

	let { id } = req.params;
	if (id.startsWith("UU")) id = id.replace("UU", "UC");
	if (!id.startsWith("UC")) return res.status(400).json({
		status: 400,
		error: "Invalid channel ID."
	})
	fetch(`https://yt.lemnoslife.com/noKey/search?part=snippet,id&channelId=${id}&maxResults=1&order=date&videoDuration=medium&type=video`).then((re) => re.json()).then(async (d) => {
		const longVideos = await fetch(`https://yt.lemnoslife.com/noKey/search?part=snippet,id&channelId=${id}&maxResults=1&order=date&videoDuration=long&type=video`).then((res) => res.json())
		try {
			const data = d.items.concat(longVideos.items).sort((a, z) => new Date(z.snippet.publishTime) - new Date(a.snippet.publishTime))
			res.json({
				videoId: data[0].id.videoId,
				title: data[0].snippet.title,
				dateUploaded: data[0].snippet.publishTime,
			})
		} catch (err) {
			console.error(err)
			return res.status(500).json({
				status: 500,
				error: "An interal error occured."
			})
		}
	})
})

api.get('/:id/shorts', (req, res) => {

	let { id } = req.params;
	if (id.startsWith("UU")) id = id.replace("UU", "UC");
	if (!id.startsWith("UC")) return res.status(400).json({
		status: 400,
		error: "Invalid channel ID."
	})
	fetch(`https://yt.lemnoslife.com/noKey/search?part=snippet,id&channelId=${id}&maxResults=1&order=date&videoDuration=short&type=video`).then((re) => re.json()).then((d) => {
		try {
			res.json({
				videoId: d.items[0].id.videoId,
				title: d.items[0].snippet.title,
				dateUploaded: d.items[0].snippet.publishTime,
			})
		} catch {
			return res.status(500).json({
				status: 500,
				error: "An interal error occured."
			})
		}
	})
})

api.listen(3000, () => {
	console.log("API is running on port 3000")
});

process.on("unhandledRejection", (err) => console.error(err));
