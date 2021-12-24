const fs = require('fs')  
const axios = require('axios')
const path = require('path')  
const domain = 'https://wptavern.com'

async function downloadImage(id) {  
	const url = `${domain}/wp-json/wp/v2/media/${id}`
	const uploads = path.resolve(__dirname, 'images', `${id}.jpg`)
	const writer = fs.createWriteStream(uploads)

	axios.get(url)
	.then(res => {
		// console.log(res)
		axios({
			method: "get",
			url: res.data.guid.rendered,
			responseType: "stream"
		}).then(function (response) {
			response.data.pipe(writer);
		});
	})
	.catch(err => {
		console.log(err)
	})
}

axios.get(`${domain}/wp-json/wp/v2/posts?per_page=100`)
.then(res => {
    res.data.forEach(item => {
        // console.log(item.featured_media)
        downloadImage(item.featured_media)  
    });
    
})
.catch(err => {
	console.log(`Error: ${err}`)
})
